// app/api/users/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Custom error response helper
const errorResponse = (message: string, status: number = 500) => {
  return NextResponse.json({ error: message }, { status });
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 5;
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return errorResponse('Invalid pagination parameters', 400);
    }

    // Validate role if provided
    if (role && !['USER', 'ADMIN'].includes(role)) {
      return errorResponse('Invalid role specified', 400);
    }

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
          ],
        } : {},
        role ? { role } : {},
        isActive !== null ? { isActive: isActive === 'true' } : {},
      ],
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
    ]).catch((error) => {
      console.error('Database query error:', error);
      throw new Error('Failed to fetch users');
    });

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET users error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Internal server error');
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => {
      throw new Error('Invalid JSON payload');
    });

    // Validate required fields
    if (!data.name?.trim()) {
      return errorResponse('Name is required', 400);
    }

    if (!data.email?.trim()) {
      return errorResponse('Email is required', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return errorResponse('Invalid email format', 400);
    }

    // Validate phone format if provided
    if (data.phone && !/^\+?[\d\s-]{8,}$/.test(data.phone)) {
      return errorResponse('Invalid phone number format', 400);
    }

    // Validate role if provided
    if (data.role && !['USER', 'ADMIN'].includes(data.role)) {
      return errorResponse('Invalid role specified', 400);
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: data.role || 'USER',
        isActive: data.isActive ?? true,
      },
    }).catch((error) => {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('POST user error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to create user',
      error instanceof Error && error.message === 'Email already exists' ? 409 : 500
    );
  }
}
