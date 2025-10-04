'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddressAutocomplete } from '@/components/address-autocomplete';
import { Loader2, MapPin, Plus, Edit, Trash2, Star } from 'lucide-react';
import { Address } from '@/lib/types';

interface SavedAddress {
  id: string;
  email: string;
  label: string;
  address: Address;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface SavedAddressesManagerProps {
  userEmail: string;
  onSelectAddress?: (address: Address) => void;
  className?: string;
}

export function SavedAddressesManager({ userEmail, onSelectAddress, className = '' }: SavedAddressesManagerProps) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  // Form state
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState<Address>({
    street: '',
    suburb: '',
    state: '',
    postcode: '',
    unit: ''
  });
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, [userEmail]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`/api/saved-addresses?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Failed to fetch saved addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!label || !address.street || !address.suburb || !address.state || !address.postcode) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const url = editingAddress ? `/api/saved-addresses/${editingAddress.id}` : '/api/saved-addresses';
      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          label,
          address,
          is_default: isDefault,
        }),
      });

      if (response.ok) {
        await fetchAddresses();
        resetForm();
        setIsOpen(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save address');
      }
    } catch (error) {
      alert('Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAddress = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setLabel(addr.label);
    setAddress(addr.address);
    setIsDefault(addr.is_default);
    setIsOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await fetch(`/api/saved-addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchAddresses();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete address');
      }
    } catch (error) {
      alert('Failed to delete address');
    }
  };

  const handleSelectAddress = (addr: SavedAddress) => {
    onSelectAddress?.(addr.address);
  };

  const resetForm = () => {
    setLabel('');
    setAddress({
      street: '',
      suburb: '',
      state: '',
      postcode: '',
      unit: ''
    });
    setIsDefault(false);
    setEditingAddress(null);
  };

  const handleAddressSelect = (placeDetails: any) => {
    // Parse Google Places address components
    const addressComponents = placeDetails.address_components || [];
    let suburb = '', state = '', postcode = '';

    addressComponents.forEach((component: any) => {
      const types = component.types;

      if (types.includes('locality') || types.includes('sublocality')) {
        suburb = component.long_name;
      }

      if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      }

      if (types.includes('postal_code')) {
        postcode = component.long_name;
      }
    });

    setAddress({
      ...address,
      street: placeDetails.formatted_address,
      suburb: suburb || address.suburb,
      state: state || address.state,
      postcode: postcode || address.postcode,
    });
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Saved Addresses</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
              <DialogDescription>
                {editingAddress ? 'Update your saved address details.' : 'Save an address for faster checkout.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="label">Address Label *</Label>
                <Input
                  id="label"
                  placeholder="e.g., Home, Work, Mum's House"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="street">Street Address *</Label>
                <AddressAutocomplete
                  value={address.street}
                  onChange={(value) => setAddress({ ...address, street: value })}
                  onSelect={handleAddressSelect}
                  placeholder="Start typing your address..."
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit/Apartment (Optional)</Label>
                <Input
                  id="unit"
                  placeholder="Unit 5"
                  value={address.unit || ''}
                  onChange={(e) => setAddress({ ...address, unit: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="suburb">Suburb *</Label>
                  <Input
                    id="suburb"
                    placeholder="Sydney"
                    value={address.suburb}
                    onChange={(e) => setAddress({ ...address, suburb: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="postcode">Postcode *</Label>
                  <Input
                    id="postcode"
                    placeholder="2000"
                    value={address.postcode}
                    onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={address.state} onValueChange={(value) => setAddress({ ...address, state: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NSW">New South Wales</SelectItem>
                    <SelectItem value="VIC">Victoria</SelectItem>
                    <SelectItem value="QLD">Queensland</SelectItem>
                    <SelectItem value="WA">Western Australia</SelectItem>
                    <SelectItem value="SA">South Australia</SelectItem>
                    <SelectItem value="TAS">Tasmania</SelectItem>
                    <SelectItem value="ACT">Australian Capital Territory</SelectItem>
                    <SelectItem value="NT">Northern Territory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isDefault" className="text-sm">
                  Set as default address
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveAddress} disabled={isSaving} className="flex-1">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingAddress ? 'Update Address' : 'Save Address'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No saved addresses yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first address to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {addresses.map((addr) => (
            <Card key={addr.id} className={`cursor-pointer transition-colors ${addr.is_default ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1" onClick={() => handleSelectAddress(addr)}>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{addr.label}</h4>
                      {addr.is_default && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {addr.address.unit && `${addr.address.unit}, `}
                      {addr.address.street}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {addr.address.suburb}, {addr.address.state} {addr.address.postcode}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(addr)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
