import { Prisma } from '@prisma/client';

// Interface that matches our schema
export interface IAsset {
  id?: number;
  name: string;
  type: string;
  description?: string | null;
  status?: string;
  location?: string | null;
  department?: string | null;
  purchaseDate?: Date | null;
  purchaseCost?: number | null;
  vendor?: string | null;
  warrantyExpiration?: Date | null;
  serialNumber?: string | null;
  barcode?: string | null;
  lastMaintenance?: Date | null;
  nextMaintenance?: Date | null;
  imageUrl?: string | null;
  assignedUserId?: number | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AssetFilters {
  search?: string;
  type?: string;
  status?: string;
  department?: string;
  sortBy?: 'name' | 'type' | 'status' | 'purchaseDate' | 'purchaseCost';
  order?: Prisma.SortOrder;
}

// Use exact types from Prisma schema
export type AssetCreateInput = Prisma.AssetUncheckedCreateInput;
export type AssetUpdateInput = Prisma.AssetUncheckedUpdateInput;
export type AssetWhereInput = Prisma.AssetWhereInput;
export type AssetOrderByInput = Prisma.AssetOrderByWithRelationInput;

export type AssetResponse = Prisma.AssetGetPayload<{
  include: {
    assignedTo: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>; 