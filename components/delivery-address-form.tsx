"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AUSTRALIAN_STATES, type Address } from "@/lib/types"
import { AddressAutocomplete } from "@/components/address-autocomplete"

interface DeliveryAddressFormProps {
  address: Address
  onAddressChange: (address: Address) => void
}

export function DeliveryAddressForm({ address, onAddressChange }: DeliveryAddressFormProps) {
  const updateField = (field: keyof Address, value: string) => {
    onAddressChange({ ...address, [field]: value })
  }

  const handleAddressSelect = (placeDetails: any) => {
    // Parse Google Places address components to extract suburb, state, postcode
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

    // Update all address fields with the parsed data
    const updatedAddress: Address = {
      ...address,
      street: placeDetails.formatted_address,
      suburb: suburb || address.suburb,
      state: state || address.state,
      postcode: postcode || address.postcode,
    };

    onAddressChange(updatedAddress);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="street">Street Address *</Label>
        <AddressAutocomplete
          value={address.street}
          onChange={(value) => updateField("street", value)}
          onSelect={handleAddressSelect}
          placeholder="Start typing your address..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="unit">Unit/Apartment (Optional)</Label>
        <Input
          id="unit"
          placeholder="Unit 5"
          value={address.unit || ""}
          onChange={(e) => updateField("unit", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="suburb">Suburb *</Label>
          <Input
            id="suburb"
            placeholder="Sydney"
            value={address.suburb}
            onChange={(e) => updateField("suburb", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="postcode">Postcode *</Label>
          <Input
            id="postcode"
            placeholder="2000"
            value={address.postcode}
            onChange={(e) => updateField("postcode", e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="state">State *</Label>
        <Select value={address.state} onValueChange={(v) => updateField("state", v)}>
          <SelectTrigger id="state">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AUSTRALIAN_STATES.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
