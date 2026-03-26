import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/user/charity — Update user's charity selection
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { charity_id, contribution_percentage } = body;

  if (contribution_percentage !== undefined && (contribution_percentage < 10 || contribution_percentage > 100)) {
    return NextResponse.json({ error: 'Contribution must be between 10% and 100%' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (charity_id !== undefined) updates.charity_id = charity_id;
  if (contribution_percentage !== undefined) updates.contribution_percentage = contribution_percentage;

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
