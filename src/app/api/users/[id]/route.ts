// app/api/users/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const data = await req.json();

  const updated = await prisma.user.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  const deleted = await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json(deleted);
}
