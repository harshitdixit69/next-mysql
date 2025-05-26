'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IAsset } from '@/app/api/types/asset.types';
import { toast } from 'sonner';

interface EditAssetDialogProps {
  asset: IAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export function EditAssetDialog({ asset, open, onOpenChange, onComplete }: EditAssetDialogProps) {
  const [formData, setFormData] = useState<IAsset>(
    asset || {
      name: '',
      type: '',
      description: '',
      status: 'AVAILABLE',
      location: '',
      department: '',
      purchaseDate: undefined,
      purchaseCost: undefined,
      vendor: '',
      warrantyExpiration: undefined,
      serialNumber: '',
      barcode: '',
      lastMaintenance: undefined,
      nextMaintenance: undefined,
      notes: '',
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            formDataToSend.append(key, value.toISOString());
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      const url = asset?.id ? `/api/assets?id=${asset.id}` : '/api/assets';
      const method = asset?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to save asset');

      toast.success(`Asset ${asset?.id ? 'updated' : 'created'} successfully`);
      onComplete();
    } catch (error) {
      console.error('Error saving asset:', error);
      toast.error(`Failed to ${asset?.id ? 'update' : 'create'} asset`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof IAsset, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{asset?.id ? 'Edit Asset' : 'Create New Asset'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="IN_USE">In Use</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="RETIRED">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate ? new Date(formData.purchaseDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange('purchaseDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseCost">Purchase Cost</Label>
              <Input
                id="purchaseCost"
                type="number"
                step="0.01"
                value={formData.purchaseCost || ''}
                onChange={(e) => handleChange('purchaseCost', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={formData.vendor || ''}
                onChange={(e) => handleChange('vendor', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyExpiration">Warranty Expiration</Label>
              <Input
                id="warrantyExpiration"
                type="date"
                value={formData.warrantyExpiration ? new Date(formData.warrantyExpiration).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange('warrantyExpiration', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber || ''}
                onChange={(e) => handleChange('serialNumber', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode || ''}
                onChange={(e) => handleChange('barcode', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastMaintenance">Last Maintenance</Label>
              <Input
                id="lastMaintenance"
                type="date"
                value={formData.lastMaintenance ? new Date(formData.lastMaintenance).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange('lastMaintenance', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextMaintenance">Next Maintenance</Label>
              <Input
                id="nextMaintenance"
                type="date"
                value={formData.nextMaintenance ? new Date(formData.nextMaintenance).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange('nextMaintenance', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 