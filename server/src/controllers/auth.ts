import type { Request, Response } from "express";
import { parseCookie } from "cookie";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken, type JwtPayload } from "../utils/tokens.js";
import { setRefreshCookie, clearRefreshCookie, REFRESH_COOKIE } from "../utils/cookies.js";

function publicUser(u: { _id: unknown; name: string; email: string; role: string; occupation?: string }) {
  return { _id: String(u._id), name: u.name, email: u.email, role: u.role, occupation: u.occupation };
}
// No cookie-parser: read the one refresh cookie from the raw header.
function readRefreshCookie(req: Request): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  return parseCookie(header)[REFRESH_COOKIE];
}
async function issue(res: Response, payload: JwtPayload): Promise<string> {
  setRefreshCookie(res, await signRefreshToken(payload));
  return signAccessToken(payload);
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as { name: string; email: string; password: string };
  if (await User.exists({ email })) throw new ApiError(409, "Email already registered");
  const user = await User.create({ name, email, password, role: "user" }); // role forced
  const accessToken = await issue(res, { sub: String(user._id), role: user.role, tokenVersion: user.tokenVersion });
  res.status(201).json({ accessToken, user: publicUser(user) });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) throw ApiError.unauthorized("Invalid credentials");
  const accessToken = await issue(res, { sub: String(user._id), role: user.role, tokenVersion: user.tokenVersion });
  res.status(200).json({ accessToken, user: publicUser(user) });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = readRefreshCookie(req);
  if (!token) throw ApiError.unauthorized("No refresh token");
  let payload: JwtPayload;
  try { payload = await verifyRefreshToken(token); } catch { throw ApiError.unauthorized("Invalid refresh token"); }
  const user = await User.findById(payload.sub);
  if (!user || user.tokenVersion !== payload.tokenVersion) throw ApiError.unauthorized("Session expired");
  const accessToken = await issue(res, { sub: String(user._id), role: user.role, tokenVersion: user.tokenVersion });
  res.status(200).json({ accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = readRefreshCookie(req);
  if (token) {
    try {
      const payload = await verifyRefreshToken(token);
      await User.findByIdAndUpdate(payload.sub, { $inc: { tokenVersion: 1 } });
    } catch { /* ignore */ }
  }
  clearRefreshCookie(res);
  res.status(204).send();
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw ApiError.notFound("User not found");
  res.status(200).json(publicUser(user));
});
