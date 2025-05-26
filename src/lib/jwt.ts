import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);
const TOKEN_EXPIRY = '24h';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Validate that the payload has the required properties
    if (!payload.userId || !payload.email || !payload.role) {
      throw new Error('Invalid token payload');
    }
    
    return {
      userId: Number(payload.userId),
      email: String(payload.email),
      role: String(payload.role)
    };
  } catch (error) {
    console.error('JWT verification error:', error);
    throw new Error('Invalid token');
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}

export async function getUserFromToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return await verifyToken(token);
  } catch (error) {
    return null;
  }
} 