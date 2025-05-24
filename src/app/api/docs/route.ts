import { NextResponse } from 'next/server';
import swaggerDoc from '../../../../swagger.json';

export async function GET() {
  return NextResponse.json(swaggerDoc);
} 