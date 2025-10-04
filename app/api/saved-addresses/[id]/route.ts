import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { label, address, is_default } = body;

    if (!label && !address && is_default === undefined) {
      return NextResponse.json({ error: 'At least one field must be provided' }, { status: 400 });
    }

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the address first to check ownership
    const { data: existingAddress, error: fetchError } = await supabase
      .from('saved_addresses')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // If setting as default, unset other default addresses for this email
    if (is_default) {
      await supabase
        .from('saved_addresses')
        .update({ is_default: false })
        .eq('email', existingAddress.email)
        .neq('id', params.id);
    }

    // Update the address
    const updateData: any = {};
    if (label) updateData.label = label;
    if (address) updateData.address = address;
    if (is_default !== undefined) updateData.is_default = is_default;

    const { data, error } = await supabase
      .from('saved_addresses')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating saved address:', error);
      return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in saved addresses PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the address first to check ownership
    const { data: existingAddress, error: fetchError } = await supabase
      .from('saved_addresses')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Delete the address
    const { error } = await supabase
      .from('saved_addresses')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting saved address:', error);
      return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in saved addresses DELETE API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
