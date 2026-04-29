import { v } from "convex/values";
import { mutation } from "./_generated/server";

const ADMIN_PASSWORD = "blablablaCSC2026";

function generateToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

export const adminLogin = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    if (args.password !== ADMIN_PASSWORD) {
      throw new Error("Invalid password");
    }

    const token = generateToken();
    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours

    await ctx.db.insert("adminSessions", {
      token,
      createdAt: now,
      expiresAt,
    });

    return { token };
  },
});

export const validateToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();

    if (!session || session.expiresAt < Date.now()) {
      return { valid: false };
    }
    return { valid: true };
  },
});

export const adminLogout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
    return { success: true };
  },
});
