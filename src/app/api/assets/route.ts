import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, AssetStatus, Role } from '@prisma/client';

// Custom error logger
const logError = (method: string, error: any, additionalInfo?: any) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${method} Error:`, {
    message: error.message,
    code: error.code,
    stack: error.stack,
    additionalInfo,
  });
};

// Error response helper
const createErrorResponse = (status: number, message: string) => {
  return NextResponse.json(
    { error: message },
    { status }
  );
};

// Generate Asset ID helper
const generateAssetId = async () => {
  const count = await prisma.asset.count();
  return `AST-${String(count + 1).padStart(5, '0')}`;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries()) as any;

    // Input validation
    if (!body.name?.trim()) {
      return createErrorResponse(400, 'Asset name is required');
    }
    if (!body.type?.trim()) {
      return createErrorResponse(400, 'Asset type is required');
    }

    // Handle image upload if present
    let imageUrl = null;
    const image = formData.get('image') as File | null;
    if (image) {
      // Add your image upload logic here
      // imageUrl = await uploadImage(image);
    }

    // Generate asset ID
    const assetId = await generateAssetId();

    // Create asset with image
    const asset = await prisma.asset.create({
      data: {
        name: body.name,
        type: body.type,
        description: body.description,
        status: (body.status as AssetStatus) || AssetStatus.AVAILABLE,
        location: body.location,
        department: body.department,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        purchaseCost: body.purchaseCost ? new Prisma.Decimal(body.purchaseCost) : null,
        vendor: body.vendor,
        warrantyExpiration: body.warrantyExpiration ? new Date(body.warrantyExpiration) : null,
        serialNumber: body.serialNumber,
        barcode: body.barcode,
        lastMaintenance: body.lastMaintenance ? new Date(body.lastMaintenance) : null,
        nextMaintenance: body.nextMaintenance ? new Date(body.nextMaintenance) : null,
        imageUrl: imageUrl,
        assignedUserId: body.assignedUserId ? parseInt(body.assignedUserId) : null,
        notes: body.notes
      },
      include: {
        assignedTo: true
      }
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    logError('POST', error, { requestBody: 'Form Data' });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return createErrorResponse(400, 'Asset with this serial number or barcode already exists');
        case 'P2003':
          return createErrorResponse(400, 'Invalid reference to related record');
        case 'P2025':
          return createErrorResponse(404, 'Referenced record not found');
        default:
          return createErrorResponse(500, 'Database operation failed');
      }
    }

    return createErrorResponse(500, 'Internal server error');
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Search
    const search = searchParams.get('search')?.trim();
    
    // Filters
    const status = searchParams.get('status') as AssetStatus | null;
    const type = searchParams.get('type');
    const department = searchParams.get('department');
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

    // Build where clause
    const where: Prisma.AssetWhereInput = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { serialNumber: { contains: search } },
        { barcode: { contains: search } }
      ];
    }

    if (status) where.status = status;
    if (type) where.type = type;
    if (department) where.department = department;

    // Build order by
    const orderBy: Prisma.AssetOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'name':
        orderBy.name = sortOrder;
        break;
      case 'purchaseDate':
        orderBy.purchaseDate = sortOrder;
        break;
      case 'cost':
        orderBy.purchaseCost = sortOrder;
        break;
      default:
        orderBy.name = 'asc';
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          assignedTo: true
        }
      }),
      prisma.asset.count({ where })
    ]);

    return NextResponse.json({
      data: assets,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logError('GET', error, { url: req.url });
    return createErrorResponse(500, 'Error fetching assets');
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return createErrorResponse(400, 'Asset ID is required');
    }

    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries()) as any;
    const assetId = parseInt(id);

    // Handle image update if present
    let imageUrl = undefined;
    const image = formData.get('image') as File | null;
    if (image) {
      // Add your image upload logic here
      // imageUrl = await uploadImage(image);
    }

    // Validate if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id: assetId }
    });

    if (!existingAsset) {
      return createErrorResponse(404, 'Asset not found');
    }

    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        name: body.name,
        type: body.type,
        description: body.description,
        status: body.status as AssetStatus,
        location: body.location,
        department: body.department,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : undefined,
        purchaseCost: body.purchaseCost ? new Prisma.Decimal(body.purchaseCost) : undefined,
        vendor: body.vendor,
        warrantyExpiration: body.warrantyExpiration ? new Date(body.warrantyExpiration) : undefined,
        serialNumber: body.serialNumber,
        barcode: body.barcode,
        lastMaintenance: body.lastMaintenance ? new Date(body.lastMaintenance) : undefined,
        nextMaintenance: body.nextMaintenance ? new Date(body.nextMaintenance) : undefined,
        imageUrl: imageUrl,
        assignedUserId: body.assignedUserId ? parseInt(body.assignedUserId) : undefined,
        notes: body.notes
      },
      include: {
        assignedTo: true
      }
    });

    return NextResponse.json(asset);
  } catch (error) {
    logError('PUT', error, { id: req.url });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return createErrorResponse(400, 'Asset with this serial number or barcode already exists');
        case 'P2025':
          return createErrorResponse(404, 'Asset not found');
        default:
          return createErrorResponse(500, 'Database operation failed');
      }
    }

    return createErrorResponse(500, 'Internal server error');
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return createErrorResponse(400, 'Asset ID is required');
    }

    const assetId = parseInt(id);

    // Validate if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id: assetId }
    });

    if (!existingAsset) {
      return createErrorResponse(404, 'Asset not found');
    }

    await prisma.asset.delete({
      where: { id: assetId },
    });

    return NextResponse.json(
      { message: 'Asset deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    logError('DELETE', error, { id: req.url });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          return createErrorResponse(404, 'Asset not found');
        case 'P2003':
          return createErrorResponse(400, 'Cannot delete asset due to existing references');
        default:
          return createErrorResponse(500, 'Database operation failed');
      }
    }

    return createErrorResponse(500, 'Internal server error');
  }
} 