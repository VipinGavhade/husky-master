"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase.types";

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Export Task type inferred from the Database interface for tasks table
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
