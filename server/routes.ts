import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTicketSchema, insertResponseSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import { sendVerificationEmail, resendVerificationEmail, sendPasswordResetEmail } from "./supabase";
import { randomBytes } from "crypto";
import { getConfig } from "./config";

declare module 'cookie-session' {
  interface CookieSessionObject {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const config = getConfig();
  
  // Initialize admin email on startup
  const initAdminEmail = async () => {
    const adminEmail = config.admin.default_email;
    const existingAdmin = await storage.getAdminEmailByEmail(adminEmail);
    if (!existingAdmin) {
      await storage.createAdminEmail(adminEmail);
      console.log(`Admin email ${adminEmail} added to whitelist`);
    }
  };
  
  // Run initialization
  initAdminEmail().catch(console.error);

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, fullName } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const allUsers = await storage.getAllUsers();
      const isFirstUser = allUsers.length === 0;

      // Check if email is in admin whitelist
      const isAdminEmail = await storage.isAdminEmail(email);

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        fullName,
        isAdmin: (isFirstUser || isAdminEmail) ? "true" : "false"
      });

      // Generate verification token
      const verificationToken = randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.updateUserVerification(user.id, verificationToken, tokenExpiry);

      // Send verification email
      try {
        await sendVerificationEmail(email, verificationToken, fullName);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        return res.status(500).json({ error: "Failed to send verification email. Please try again." });
      }

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          fullName: user.fullName, 
          isAdmin: user.isAdmin,
          emailVerified: user.emailVerified
        },
        message: "Registration successful. Please check your email to verify your account."
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (user.emailVerified !== "true") {
        return res.status(403).json({ 
          error: "Email not verified", 
          requiresVerification: true,
          email: user.email 
        });
      }

      req.session.userId = user.id;
      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          fullName: user.fullName, 
          isAdmin: user.isAdmin,
          emailVerified: user.emailVerified
        } 
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        fullName: user.fullName, 
        isAdmin: user.isAdmin,
        emailVerified: user.emailVerified
      } 
    });
  });

  // Ticket routes
  app.get("/api/tickets", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    let tickets;
    if (user.isAdmin === "true") {
      tickets = await storage.getAllTickets();
    } else {
      tickets = await storage.getTicketsByUserId(req.session.userId);
    }

    const ticketsWithCounts = await Promise.all(
      tickets.map(async (ticket) => ({
        ...ticket,
        responseCount: await storage.getResponseCountByTicketId(ticket.id),
      }))
    );

    res.json({ tickets: ticketsWithCounts });
  });

  app.get("/api/tickets/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const ticket = await storage.getTicket(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const user = await storage.getUser(req.session.userId);
    if (user?.isAdmin !== "true" && ticket.userId !== req.session.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json({ ticket });
  });

  app.post("/api/tickets", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const ticketData = insertTicketSchema.parse({
        ...req.body,
        userId: req.session.userId
      });

      const ticket = await storage.createTicket(ticketData);
      res.json({ ticket });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.patch("/api/tickets/:id/status", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (user?.isAdmin !== "true") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { status } = req.body;
    const ticket = await storage.updateTicketStatus(req.params.id, status);
    
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json({ ticket });
  });

  // Response routes
  app.get("/api/tickets/:ticketId/responses", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const ticket = await storage.getTicket(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const user = await storage.getUser(req.session.userId);
    if (user?.isAdmin !== "true" && ticket.userId !== req.session.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const responses = await storage.getResponsesByTicketId(req.params.ticketId);
    res.json({ responses });
  });

  app.post("/api/tickets/:ticketId/responses", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const ticket = await storage.getTicket(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const user = await storage.getUser(req.session.userId);
    if (user?.isAdmin !== "true" && ticket.userId !== req.session.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    try {
      const responseData = insertResponseSchema.parse({
        ...req.body,
        ticketId: req.params.ticketId,
        userId: req.session.userId,
        isStaff: user?.isAdmin === "true" ? "true" : "false"
      });

      const response = await storage.createResponse(responseData);
      res.json({ response });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Admin email management routes
  app.get("/api/admin/emails", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (user?.isAdmin !== "true") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const emails = await storage.getAllAdminEmails();
    res.json({ emails });
  });

  app.post("/api/admin/emails", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (user?.isAdmin !== "true") {
      return res.status(403).json({ error: "Not authorized" });
    }

    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Invalid email" });
      }

      const existing = await storage.getAdminEmailByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "Email already in admin list" });
      }

      const adminEmail = await storage.createAdminEmail(email);
      res.json({ adminEmail });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.delete("/api/admin/emails/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (user?.isAdmin !== "true") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await storage.deleteAdminEmail(req.params.id);
    res.json({ success: true });
  });

  // Email verification routes
  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: "Invalid verification token" });
      }

      const user = await storage.verifyUserEmail(token);
      
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired verification token" });
      }

      // Create session after successful verification
      req.session.userId = user.id;

      res.json({ 
        success: true, 
        message: "Email verified successfully. You can now log in.",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          isAdmin: user.isAdmin,
          emailVerified: user.emailVerified
        }
      });
    } catch (error) {
      res.status(400).json({ error: "Verification failed" });
    }
  });

  app.post("/api/auth/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.emailVerified === "true") {
        return res.status(400).json({ error: "Email already verified" });
      }

      // Generate new verification token
      const verificationToken = randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.updateUserVerification(user.id, verificationToken, tokenExpiry);

      // Resend verification email
      try {
        await resendVerificationEmail(user.email, verificationToken, user.fullName);
        res.json({ 
          success: true, 
          message: "Verification email sent. Please check your inbox."
        });
      } catch (emailError) {
        console.error('Failed to resend verification email:', emailError);
        res.status(500).json({ error: "Failed to send verification email" });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Password reset routes
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ 
          success: true, 
          message: "If an account with that email exists, a password reset link has been sent."
        });
      }

      // Generate reset token (1 hour expiry)
      const resetToken = randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await storage.updateUserResetToken(user.email, resetToken, tokenExpiry);

      // Send password reset email
      try {
        await sendPasswordResetEmail(user.email, resetToken, user.fullName);
        res.json({ 
          success: true, 
          message: "If an account with that email exists, a password reset link has been sent."
        });
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        res.status(500).json({ error: "Failed to send password reset email" });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || typeof token !== 'string' || !password || typeof password !== 'string') {
        return res.status(400).json({ error: "Token and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const user = await storage.getUserByResetToken(token);
      
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      // Hash new password and update user
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await storage.resetUserPassword(token, hashedPassword);

      if (!updatedUser) {
        return res.status(400).json({ error: "Failed to reset password" });
      }

      res.json({ 
        success: true, 
        message: "Password reset successfully. You can now log in with your new password."
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
