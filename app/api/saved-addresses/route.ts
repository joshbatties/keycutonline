import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get saved addresses for the user
    const { data: addresses, error } = await supabase
      .from('saved_addresses')
      .select('*')
      .eq('email', email)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching saved addresses:', error);
      return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
    }

    return NextResponse.json(addresses || []);
  } catch (error) {
    console.error('Error in saved addresses API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { email, label, address, is_default } = body;

    if (!email || !label || !address) {
      return NextResponse.json({ error: 'Email, label, and address are required' }, { status: 400 });
    }

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If setting as default, unset other default addresses
    if (is_default) {
      await supabase
        .from('saved_addresses')
        .update({ is_default: false })
        .eq('email', email);
    }

    // Insert new address
    const { data, error } = await supabase
      .from('saved_addresses')
      .insert({
        email,
        label,
        address,
        is_default: is_default || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating saved address:', error);
      return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in saved addresses POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
