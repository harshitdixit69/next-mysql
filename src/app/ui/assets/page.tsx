'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IAsset } from '@/app/api/types/asset.types';
import { EditAssetDialog } from './EditAssetDialog';
import { toast } from 'sonner';

export default function AssetsPage() {
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<IAsset | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets');
      if (!response.ok) throw new Error('Failed to fetch assets');
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast.error('Failed to load assets');
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleEdit = (asset: IAsset) => {
    setSelectedAsset(asset);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const response = await fetch(`/api/assets?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete asset');
      
      toast.success('Asset deleted successfully');
      fetchAssets(); // Refresh the list
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    }
  };

  const handleEditComplete = () => {
    setIsEditDialogOpen(false);
    setSelectedAsset(null);
    fetchAssets(); // Refresh the list
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assets</h1>
        <Button onClick={() => handleEdit({ name: '', type: '' })}>
          Add New Asset
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>{asset.status}</TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>{asset.department}</TableCell>
                <TableCell>{asset.assignedTo?.name || 'Unassigned'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(asset)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => asset.id && handleDelete(asset.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditAssetDialog
        asset={selectedAsset}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onComplete={handleEditComplete}
      />
    </div>
  );
} 