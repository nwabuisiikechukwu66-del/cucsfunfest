import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// === PUBLIC: Create attendee after Paystack payment ===
export const createAttendee = mutation({
  args: {
    name: v.string(),
    regNumber: v.string(),
    email: v.string(),
    phone: v.string(),
    tier: v.string(),
    amount: v.number(),
    paymentMethod: v.string(),
    paystackRef: v.optional(v.string()),
    ticketCode: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Prevent duplicate ticket codes
    const existing = await ctx.db
      .query("attendees")
      .withIndex("by_ticket_code", q => q.eq("ticketCode", args.ticketCode))
      .first();

    if (existing) throw new Error("Duplicate ticket code");

    // Prevent duplicate Paystack refs
    if (args.paystackRef) {
      const dupRef = await ctx.db
        .query("attendees")
        .filter(q => q.eq(q.field("paystackRef"), args.paystackRef))
        .first();
      if (dupRef) throw new Error("Payment reference already used");
    }

    const id = await ctx.db.insert("attendees", {
      ...args,
      scanned: false,
      emailSent: false,
      createdAt: Date.now(),
    });

    return { id, ticketCode: args.ticketCode };
  },
});

// === PUBLIC: Submit transfer proof (pending verification) ===
export const submitTransferProof = mutation({
  args: {
    name: v.string(),
    regNumber: v.string(),
    email: v.string(),
    phone: v.string(),
    tier: v.string(),
    amount: v.number(),
    transferRef: v.string(),
    ticketCode: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("attendees", {
      ...args,
      paymentMethod: "transfer",
      status: "pending",
      scanned: false,
      emailSent: false,
      createdAt: Date.now(),
    });

    return { id, ticketCode: args.ticketCode };
  },
});

// === PUBLIC: Verify ticket by code (for QR scan) ===
export const verifyTicket = mutation({
  args: {
    ticketCode: v.string(),
    adminToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify admin token
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", q => q.eq("token", args.adminToken))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return { valid: false, reason: "UNAUTHORIZED" };
    }

    const attendee = await ctx.db
      .query("attendees")
      .withIndex("by_ticket_code", q => q.eq("ticketCode", args.ticketCode))
      .first();

    if (!attendee) return { valid: false, reason: "NOT_FOUND" };
    if (attendee.status !== "paid" && attendee.status !== "verified") {
      return { valid: false, reason: "NOT_PAID", name: attendee.name };
    }
    if (attendee.scanned) {
      return {
        valid: false,
        reason: "ALREADY_SCANNED",
        name: attendee.name,
        scannedAt: attendee.scannedAt,
      };
    }

    // Mark as scanned
    await ctx.db.patch(attendee._id, {
      scanned: true,
      scannedAt: Date.now(),
    });

    return {
      valid: true,
      name: attendee.name,
      tier: attendee.tier,
      ticketCode: attendee.ticketCode,
    };
  },
});

// === ADMIN: Get all attendees (requires token) ===
export const getAllAttendees = query({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", q => q.eq("token", args.adminToken))
      .first();

    if (!session || session.expiresAt < Date.now()) return null;

    return await ctx.db.query("attendees").order("desc").collect();
  },
});

// === ADMIN: Update attendee status ===
export const updateStatus = mutation({
  args: {
    id: v.id("attendees"),
    status: v.string(),
    adminToken: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", q => q.eq("token", args.adminToken))
      .first();

    if (!session || session.expiresAt < Date.now()) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, { status: args.status });
    return { success: true };
  },
});

// === ADMIN: Stats summary ===
export const getStats = query({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", q => q.eq("token", args.adminToken))
      .first();

    if (!session || session.expiresAt < Date.now()) return null;

    const all = await ctx.db.query("attendees").collect();
    const paid = all.filter(a => a.status === "paid" || a.status === "verified");
    const pending = all.filter(a => a.status === "pending");
    const scanned = all.filter(a => a.scanned);
    const totalRevenue = paid.reduce((sum, a) => sum + a.amount, 0);
    const cardPaid = paid.filter(a => a.paymentMethod === "card");
    const transferPaid = paid.filter(a => a.paymentMethod === "transfer");

    return {
      total: all.length,
      paid: paid.length,
      pending: pending.length,
      scanned: scanned.length,
      totalRevenue,
      cardCount: cardPaid.length,
      transferCount: transferPaid.length,
    };
  },
});
