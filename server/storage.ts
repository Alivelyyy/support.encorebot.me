import mongoose from 'mongoose';
import { 
  type User, 
  type InsertUser,
  type Ticket,
  type InsertTicket,
  type Response,
  type InsertResponse,
  UserModel,
  TicketModel,
  ResponseModel,
  AdminEmailModel
} from "@shared/schema";

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

export class MongoStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id).lean();
    if (!user) return undefined;
    return {
      ...user,
      id: user._id.toString(),
    } as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ email }).lean();
    if (!user) return undefined;
    return {
      ...user,
      id: user._id.toString(),
    } as User;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find().lean();
    return users.map(user => ({
      ...user,
      id: user._id.toString(),
    })) as User[];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = await UserModel.create({
      ...insertUser,
      isAdmin: insertUser.isAdmin || "false",
      emailVerified: insertUser.emailVerified || "false",
    });
    return {
      ...user.toObject(),
      id: user._id.toString(),
    } as User;
  }

  async updateUserVerification(id: string, token: string, expiry: Date): Promise<User | undefined> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { verificationToken: token, verificationTokenExpiry: expiry },
      { new: true }
    ).lean();
    if (!user) return undefined;
    return {
      ...user,
      id: user._id.toString(),
    } as User;
  }

  async verifyUserEmail(token: string): Promise<User | undefined> {
    const user = await UserModel.findOneAndUpdate(
      { 
        verificationToken: token,
        verificationTokenExpiry: { $gt: new Date() }
      },
      { 
        emailVerified: "true",
        verificationToken: null,
        verificationTokenExpiry: null
      },
      { new: true }
    ).lean();
    if (!user) return undefined;
    return {
      ...user,
      id: user._id.toString(),
    } as User;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ verificationToken: token }).lean();
    if (!user) return undefined;
    return {
      ...user,
      id: user._id.toString(),
    } as User;
  }

  // Ticket methods
  async getTicket(id: string): Promise<Ticket | undefined> {
    const ticket = await TicketModel.findById(id).lean();
    if (!ticket) return undefined;
    return {
      ...ticket,
      id: ticket._id.toString(),
      userId: ticket.userId.toString(),
    } as Ticket;
  }

  async getAllTickets(): Promise<Ticket[]> {
    const tickets = await TicketModel.find().sort({ createdAt: -1 }).lean();
    return tickets.map(ticket => ({
      ...ticket,
      id: ticket._id.toString(),
      userId: ticket.userId.toString(),
    })) as Ticket[];
  }

  async getTicketsByUserId(userId: string): Promise<Ticket[]> {
    const tickets = await TicketModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return tickets.map(ticket => ({
      ...ticket,
      id: ticket._id.toString(),
      userId: ticket.userId.toString(),
    })) as Ticket[];
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const ticket = await TicketModel.create({
      ...insertTicket,
      status: insertTicket.status || "open",
    });
    return {
      ...ticket.toObject(),
      id: ticket._id.toString(),
      userId: ticket.userId.toString(),
    } as Ticket;
  }

  async updateTicketStatus(id: string, status: string): Promise<Ticket | undefined> {
    const ticket = await TicketModel.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    ).lean();
    if (!ticket) return undefined;
    return {
      ...ticket,
      id: ticket._id.toString(),
      userId: ticket.userId.toString(),
    } as Ticket;
  }

  // Response methods
  async getResponsesByTicketId(ticketId: string): Promise<Response[]> {
    const responses = await ResponseModel.find({ ticketId }).sort({ createdAt: 1 }).lean();
    return responses.map(response => ({
      ...response,
      id: response._id.toString(),
      ticketId: response.ticketId.toString(),
      userId: response.userId.toString(),
    })) as Response[];
  }

  async getResponseCountByTicketId(ticketId: string): Promise<number> {
    return await ResponseModel.countDocuments({ ticketId });
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const response = await ResponseModel.create({
      ...insertResponse,
      isStaff: insertResponse.isStaff || "false",
    });
    return {
      ...response.toObject(),
      id: response._id.toString(),
      ticketId: response.ticketId.toString(),
      userId: response.userId.toString(),
    } as Response;
  }

  // Admin email methods
  async getAllAdminEmails() {
    const emails = await AdminEmailModel.find().sort({ createdAt: -1 }).lean();
    return emails.map(email => ({
      ...email,
      id: email._id.toString(),
    }));
  }

  async getAdminEmailByEmail(email: string) {
    const adminEmail = await AdminEmailModel.findOne({ email }).lean();
    if (!adminEmail) return undefined;
    return {
      ...adminEmail,
      id: adminEmail._id.toString(),
    };
  }

  async createAdminEmail(email: string) {
    const adminEmail = await AdminEmailModel.create({ email });
    return {
      ...adminEmail.toObject(),
      id: adminEmail._id.toString(),
    };
  }

  async deleteAdminEmail(id: string) {
    await AdminEmailModel.findByIdAndDelete(id);
  }

  async isAdminEmail(email: string): Promise<boolean> {
    const count = await AdminEmailModel.countDocuments({ email });
    return count > 0;
  }
}

export const storage = new MongoStorage();
