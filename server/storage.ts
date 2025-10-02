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
    return Array.from(this.responses.values())
      .filter((response) => response.ticketId === ticketId)
      .length;
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
}

export const storage = new MemStorage();
