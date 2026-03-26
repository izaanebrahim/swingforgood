import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/charities — List all charities
export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  let query = supabase.from('charities').select('*').order('name');

  if (category) query = query.eq('category', category);
  if (featured === 'true') query = query.eq('featured', true);
  if (search) query = query.ilike('name', `%${search}%`);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
