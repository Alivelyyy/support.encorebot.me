import { 
  type User, 
  type InsertUser,
  type Ticket,
  type InsertTicket,
  type Response,
  type InsertResponse
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from '../db';
import { users, tickets, responses, adminEmails } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;

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

  constructor() {
    this.users = new Map();
    this.tickets = new Map();
    this.responses = new Map();
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
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
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
    const result = await db.select().from(responses).where(eq(responses.ticketId, ticketId));
    return result.length;
  },

  // Admin email methods
  async getAllAdminEmails() {
    return await db.select().from(adminEmails).orderBy(desc(adminEmails.createdAt));
  },

  async getAdminEmailByEmail(email: string) {
    const result = await db.select().from(adminEmails).where(eq(adminEmails.email, email));
    return result[0];
  },

  async createAdminEmail(email: string) {
    const result = await db.insert(adminEmails).values({ email }).returning();
    return result[0];
  },

  async deleteAdminEmail(id: string) {
    await db.delete(adminEmails).where(eq(adminEmails.id, id));
  },

  async isAdminEmail(email: string): Promise<boolean> {
    const result = await db.select().from(adminEmails).where(eq(adminEmails.email, email));
    return result.length > 0;
  },
};

export const storage = new MemStorage();