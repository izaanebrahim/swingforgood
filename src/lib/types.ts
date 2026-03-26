// Database types matching Supabase schema

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
  subscription_status: 'active' | 'past_due' | 'canceled' | 'none';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  charity_id: string | null;
  contribution_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  website_url: string | null;
  category: string;
  featured: boolean;
  total_contributions: number;
  created_at: string;
}

export interface Score {
  id: string;
  user_id: string;
  score: number; // 1-45 Stableford
  date_played: string;
  created_at: string;
}

export interface Draw {
  id: string;
  month: number;
  year: number;
  status: 'pending' | 'drawn' | 'published';
  total_prize_pool: number;
  jackpot_amount: number;
  match_4_amount: number;
  match_3_amount: number;
  winning_numbers: number[];
  rollover_amount: number;
  created_at: string;
}

export interface Winner {
  id: string;
  draw_id: string;
  user_id: string;
  match_type: 3 | 4 | 5;
  matched_numbers: number[];
  prize_amount: number;
  proof_url: string | null;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Subscription plan types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  stripePriceId: string;
}
