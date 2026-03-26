import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/scores — Get user's scores
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: scores, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date_played', { ascending: false })
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: scores });
}

// POST /api/scores — Add a new score (max 5, oldest deleted)
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check subscription status
  const { data: profile } = await supabase
    .from('users')
    .select('subscription_status')
    .eq('id', user.id)
    .single();

  if (!profile || profile.subscription_status !== 'active') {
    return NextResponse.json({ error: 'Active subscription required' }, { status: 403 });
  }

  const body = await request.json();
  const { score, date_played } = body;

  // Validate score
  if (!score || score < 1 || score > 45) {
    return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 });
  }

  if (!date_played) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  // Count existing scores
  const { data: existing, error: countError } = await supabase
    .from('scores')
    .select('id, date_played')
    .eq('user_id', user.id)
    .order('date_played', { ascending: true });

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  // If 5 scores exist, delete the oldest one
  if (existing && existing.length >= 5) {
    const oldestId = existing[0].id;
    await supabase.from('scores').delete().eq('id', oldestId);
  }

  // Insert new score
  const { data: newScore, error: insertError } = await supabase
    .from('scores')
    .insert({
      user_id: user.id,
      score,
      date_played,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: newScore });
}

// DELETE /api/scores — Delete a score by ID
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Score ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
