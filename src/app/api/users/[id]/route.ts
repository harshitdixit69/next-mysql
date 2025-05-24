// app/api/users/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

const errorResponse = (message: string, status: number = 500) => {
  return NextResponse.json({ error: message }, { status });
};

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid user ID', 400);
    }

    const data = await req.json().catch(() => {
      throw new Error('Invalid JSON payload');
    });

    // Validate email format if provided
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return errorResponse('Invalid email format', 400);
      }
    }

    // Validate phone format if provided
    if (data.phone && !/^\+?[\d\s-]{8,}$/.test(data.phone)) {
      return errorResponse('Invalid phone number format', 400);
    }

    // Validate role if provided
    if (data.role && !['USER', 'ADMIN'].includes(data.role)) {
      return errorResponse('Invalid role specified', 400);
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: data.role,
        isActive: data.isActive
      },
    }).catch((error) => {
      if (error.code === 'P2025') {
        throw new Error('User not found');
      }
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('PUT user error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update user';
    const status = 
      message === 'User not found' ? 404 :
      message === 'Email already exists' ? 409 : 500;
    return errorResponse(message, status);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  const deleted = await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json(deleted);
}
