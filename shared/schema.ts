import mongoose from 'mongoose';
import { z } from 'zod';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  isAdmin: { type: String, default: 'false' },
  emailVerified: { type: String, default: 'false' },
  verificationToken: { type: String },
  verificationTokenExpiry: { type: Date },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Ticket Schema
const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  service: { type: String, required: true },
  status: { type: String, default: 'open' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Response Schema
const responseSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  isStaff: { type: String, default: 'false' },
  createdAt: { type: Date, default: Date.now },
});

// Admin Email Schema
const adminEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

// Models
export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const TicketModel = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
export const ResponseModel = mongoose.models.Response || mongoose.model('Response', responseSchema);
export const AdminEmailModel = mongoose.models.AdminEmail || mongoose.model('AdminEmail', adminEmailSchema);

// Zod schemas for validation
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  isAdmin: z.string().optional(),
  emailVerified: z.string().optional(),
  verificationToken: z.string().optional(),
  verificationTokenExpiry: z.date().optional(),
  resetToken: z.string().optional(),
  resetTokenExpiry: z.date().optional(),
});

export const insertTicketSchema = z.object({
  userId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string(),
  service: z.string(),
  status: z.string().optional(),
});

export const insertResponseSchema = z.object({
  ticketId: z.string(),
  userId: z.string(),
  message: z.string().min(1),
  isStaff: z.string().optional(),
});

export const insertAdminEmailSchema = z.object({
  email: z.string().email(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  isAdmin: string;
  emailVerified: string;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
};

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  service: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  isStaff: string;
  createdAt: Date;
};

export type InsertAdminEmail = z.infer<typeof insertAdminEmailSchema>;
export type AdminEmail = {
  id: string;
  email: string;
  createdAt: Date;
};
