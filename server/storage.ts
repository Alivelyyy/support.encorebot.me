import { 
  type User, 
  type InsertUser,
  type Ticket,
  type InsertTicket,
  type Response,
  type InsertResponse
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserVerification(id: string, token: string, expiry: Date): Promise<User | undefined>;
  verifyUserEmail(token: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;

  // Ticket methods
  getTicket(id: string): Promise<Ticket | undefined>;
  getAllTickets(): Promise<Ticket[]>;
  getTicketsByUserId(userId: string): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicketStatus(id: string, status: string): Promise<Ticket | undefined>;

  // Response methods
  getResponsesByTicketId(ticketId: string): Promise<Response[]>;
  getResponseCountByTicketId(ticketId: string): Promise<number>;
  createResponse(response: InsertResponse): Promise<Response>;

  // Admin email methods
  getAllAdminEmails(): Promise<any[]>;
  getAdminEmailByEmail(email: string): Promise<any | undefined>;
  createAdminEmail(email: string): Promise<any>;
  deleteAdminEmail(id: string): Promise<void>;
  isAdminEmail(email: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tickets: Map<string, Ticket>;
  private responses: Map<string, Response>;
  private adminEmails: Map<string, any>;

  constructor() {
    this.users = new Map();
    this.tickets = new Map();
    this.responses = new Map();
    this.adminEmails = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: insertUser.isAdmin || "false",
      emailVerified: insertUser.emailVerified || "false",
      verificationToken: insertUser.verificationToken || null,
      verificationTokenExpiry: insertUser.verificationTokenExpiry || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserVerification(id: string, token: string, expiry: Date): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      verificationToken: token,
      verificationTokenExpiry: expiry
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async verifyUserEmail(token: string): Promise<User | undefined> {
    const user = Array.from(this.users.values()).find(
      (u) => u.verificationToken === token && u.verificationTokenExpiry && u.verificationTokenExpiry > new Date()
    );
    
    if (!user) return undefined;

    const verifiedUser: User = {
      ...user,
      emailVerified: "true",
      verificationToken: null,
      verificationTokenExpiry: null
    };
    this.users.set(user.id, verifiedUser);
    return verifiedUser;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (u) => u.verificationToken === token
    );
  }

  // Ticket methods
  async getTicket(id: string): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async getAllTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getTicketsByUserId(userId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
      .filter((ticket) => ticket.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = randomUUID();
    const now = new Date();
    const ticket: Ticket = {
      ...insertTicket,
      id,
      status: insertTicket.status || "open",
      createdAt: now,
      updatedAt: now
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicketStatus(id: string, status: string): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;

    const updatedTicket: Ticket = {
      ...ticket,
      status,
      updatedAt: new Date()
    };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  // Response methods
  async getResponsesByTicketId(ticketId: string): Promise<Response[]> {
    return Array.from(this.responses.values())
      .filter((response) => response.ticketId === ticketId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getResponseCountByTicketId(ticketId: string): Promise<number> {
    return Array.from(this.responses.values())
      .filter((response) => response.ticketId === ticketId).length;
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const id = randomUUID();
    const response: Response = {
      ...insertResponse,
      id,
      isStaff: insertResponse.isStaff || "false",
      createdAt: new Date()
    };
    this.responses.set(id, response);
    return response;
  }

  // Admin email methods (in-memory storage)
  async getAllAdminEmails() {
    return Array.from(this.adminEmails.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getAdminEmailByEmail(email: string) {
    return Array.from(this.adminEmails.values()).find(
      (adminEmail) => adminEmail.email === email
    );
  }

  async createAdminEmail(email: string) {
    const id = randomUUID();
    const adminEmail = { id, email, createdAt: new Date() };
    this.adminEmails.set(id, adminEmail);
    return adminEmail;
  }

  async deleteAdminEmail(id: string) {
    this.adminEmails.delete(id);
  }

  async isAdminEmail(email: string): Promise<boolean> {
    return Array.from(this.adminEmails.values()).some(
      (adminEmail) => adminEmail.email === email
    );
  }
}

export const storage = new MemStorage();