import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  attendees: defineTable({
    name: v.string(),
    regNumber: v.string(),
    email: v.string(),
    phone: v.string(),
    tier: v.string(), // 'final' | 'other'
    amount: v.number(), // 5000 or 10000
    paymentMethod: v.string(), // 'card' | 'transfer'
    paystackRef: v.optional(v.string()),
    transferRef: v.optional(v.string()),
    ticketCode: v.string(), // CUCS-2026-XXXXXXXX
    status: v.string(), // 'paid' | 'pending' | 'verified' | 'rejected'
    scanned: v.optional(v.boolean()),
    scannedAt: v.optional(v.number()),
    emailSent: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_ticket_code", ["ticketCode"])
    .index("by_status", ["status"])
    .index("by_email", ["email"])
    .index("by_reg_number", ["regNumber"]),

  adminSessions: defineTable({
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
});
