import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env.js";

export interface JwtPayload {
  sub: string;
  role: string;
  tokenVersion: number;
}

const accessKey = () => new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshKey = () => new TextEncoder().encode(env.JWT_REFRESH_SECRET);

async function sign(payload: JwtPayload, key: Uint8Array, ttl: string): Promise<string> {
  return new SignJWT({ role: payload.role, tokenVersion: payload.tokenVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(key);
}

async function verify(token: string, key: Uint8Array): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, key);
  return { sub: String(payload.sub), role: String(payload.role), tokenVersion: Number(payload.tokenVersion) };
}

export const signAccessToken = (p: JwtPayload) => sign(p, accessKey(), env.ACCESS_TOKEN_TTL);
export const signRefreshToken = (p: JwtPayload) => sign(p, refreshKey(), env.REFRESH_TOKEN_TTL);
export const verifyAccessToken = (t: string) => verify(t, accessKey());
export const verifyRefreshToken = (t: string) => verify(t, refreshKey());
