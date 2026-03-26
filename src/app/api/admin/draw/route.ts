import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/admin/draw — Run or simulate a draw
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { month, year, action } = body; // action: 'simulate' | 'run' | 'publish'

  if (action === 'simulate' || action === 'run') {
    // Generate 5 random winning numbers (1–45)
    const winningNumbers: number[] = [];
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(num)) {
        winningNumbers.push(num);
      }
    }
    winningNumbers.sort((a, b) => a - b);

    // Calculate prize pool from active subscribers
    const { count: activeCount } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    const subscriberCount = activeCount || 0;
    const monthlyRevenue = subscriberCount * 9.99; // Approximate with monthly price
    const prizePoolTotal = monthlyRevenue * 0.5; // 50% goes to prize pool

    // Get previous rollover
    const { data: previousDraw } = await supabase
      .from('draws')
      .select('rollover_amount')
      .lt('year', year)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(1)
      .single();

    const rollover = previousDraw?.rollover_amount || 0;
    const totalPool = prizePoolTotal + rollover;

    const jackpotAmount = totalPool * 0.4;
    const match4Amount = totalPool * 0.35;
    const match3Amount = totalPool * 0.25;

    if (action === 'simulate') {
      // Return simulation results without saving
      // Find potential winners
      const { data: allScores } = await supabase
        .from('scores')
        .select('user_id, score');

      // Group scores by user
      const userScores: Record<string, number[]> = {};
      allScores?.forEach((s) => {
        if (!userScores[s.user_id]) userScores[s.user_id] = [];
        userScores[s.user_id].push(s.score);
      });

      const potentialWinners: { user_id: string; match_type: number; matched: number[] }[] = [];
      Object.entries(userScores).forEach(([userId, scores]) => {
        const matched = scores.filter((s) => winningNumbers.includes(s));
        if (matched.length >= 3) {
          potentialWinners.push({
            user_id: userId,
            match_type: Math.min(matched.length, 5),
            matched,
          });
        }
      });

      return NextResponse.json({
        success: true,
        data: {
          simulation: true,
          winning_numbers: winningNumbers,
          total_prize_pool: totalPool,
          jackpot_amount: jackpotAmount,
          match_4_amount: match4Amount,
          match_3_amount: match3Amount,
          potential_winners: potentialWinners,
          subscriber_count: subscriberCount,
        },
      });
    }

    // action === 'run' — save draw
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .upsert({
        month,
        year,
        status: 'drawn',
        winning_numbers: winningNumbers,
        total_prize_pool: totalPool,
        jackpot_amount: jackpotAmount,
        match_4_amount: match4Amount,
        match_3_amount: match3Amount,
        rollover_amount: 0,
      }, { onConflict: 'month,year' })
      .select()
      .single();

    if (drawError) {
      return NextResponse.json({ error: drawError.message }, { status: 500 });
    }

    // Find winners
    const { data: allScores } = await supabase
      .from('scores')
      .select('user_id, score');

    const userScores: Record<string, number[]> = {};
    allScores?.forEach((s) => {
      if (!userScores[s.user_id]) userScores[s.user_id] = [];
      userScores[s.user_id].push(s.score);
    });

    let has5Winner = false;
    const winners: { draw_id: string; user_id: string; match_type: number; matched_numbers: number[]; prize_amount: number; status: string }[] = [];

    const winnersBy: Record<number, string[]> = { 5: [], 4: [], 3: [] };
    Object.entries(userScores).forEach(([userId, scores]) => {
      const matched = scores.filter((s) => winningNumbers.includes(s));
      const matchCount = Math.min(matched.length, 5);
      if (matchCount >= 3) {
        winnersBy[matchCount].push(userId);
      }
    });

    // 5-match winners
    if (winnersBy[5].length > 0) {
      has5Winner = true;
      const prizePerWinner = jackpotAmount / winnersBy[5].length;
      winnersBy[5].forEach((userId) => {
        const matched = userScores[userId].filter((s) => winningNumbers.includes(s));
        winners.push({
          draw_id: draw.id,
          user_id: userId,
          match_type: 5,
          matched_numbers: matched.slice(0, 5),
          prize_amount: prizePerWinner,
          status: 'pending',
        });
      });
    }

    // 4-match winners
    if (winnersBy[4].length > 0) {
      const prizePerWinner = match4Amount / winnersBy[4].length;
      winnersBy[4].forEach((userId) => {
        const matched = userScores[userId].filter((s) => winningNumbers.includes(s));
        winners.push({
          draw_id: draw.id,
          user_id: userId,
          match_type: 4,
          matched_numbers: matched.slice(0, 4),
          prize_amount: prizePerWinner,
          status: 'pending',
        });
      });
    }

    // 3-match winners
    if (winnersBy[3].length > 0) {
      const prizePerWinner = match3Amount / winnersBy[3].length;
      winnersBy[3].forEach((userId) => {
        const matched = userScores[userId].filter((s) => winningNumbers.includes(s));
        winners.push({
          draw_id: draw.id,
          user_id: userId,
          match_type: 3,
          matched_numbers: matched.slice(0, 3),
          prize_amount: prizePerWinner,
          status: 'pending',
        });
      });
    }

    // Insert winners
    if (winners.length > 0) {
      await supabase.from('winners').insert(winners);
    }

    // If no 5-match winner, set rollover
    if (!has5Winner) {
      await supabase
        .from('draws')
        .update({ rollover_amount: jackpotAmount })
        .eq('id', draw.id);
    }

    return NextResponse.json({
      success: true,
      data: {
        draw,
        winners_count: winners.length,
        has_jackpot_winner: has5Winner,
      },
    });
  }

  if (action === 'publish') {
    const { error } = await supabase
      .from('draws')
      .update({ status: 'published' })
      .eq('month', month)
      .eq('year', year);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

// GET /api/admin/draw — Get draw data
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  let query = supabase.from('draws').select('*').order('year', { ascending: false }).order('month', { ascending: false });

  if (month && year) {
    query = query.eq('month', parseInt(month)).eq('year', parseInt(year));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
