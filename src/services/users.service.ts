import { supabase } from "../utils/supabaseHelper"; // Import Supabase client

export interface User {
  id: string; // UUID
  created_at?: Date; // Optional, if you want to track creation time
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  user_id: string;
  org_id?: string | null;
  role?: string | null;
  user_role?: string | null;
  location?: string | null;
  status?:
  | "pending"
  | "complete"
  | "organization_details"
  | "setup_profile"
  | "plan_selected"
  | "approved"
  | null;
  profile_picture?: string | null;
}

// Create a new user
export async function createUser(userData: Omit<User, "id">): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single(); // Insert and return the inserted data

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to create user");
  }

  return data as User;
}

// Get all users
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*"); // Get all users

  if (error) {
    throw new Error(error.message);
  }

  return data as User[];
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      *,
      organizations (
        *,
        subscriptions (
          *
        )
      )
    `
    )
    .eq("user_id", userId)
    .single();


  if (error && error.code !== "PGRST116") {
    // Error code for "no rows returned"
    throw new Error(error.message);
  }

  return data as User | null;
}

// Update user details
export async function updateUser(
  userId: string,
  userData: Partial<User>
): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("User not found or no changes were made");
  }

  return data as User;
}

export async function updateUserStatus(
  userId: string,
  status: string
): Promise<User> {
  console.log("userStatus", status, userId);
  const { data, error } = await supabase
    .from("users")
    .update({ status })
    .eq("user_id", userId)
    .select()
    .maybeSingle(); // allows 0 or 1 row
  // Use .single() instead of .maybeSingle() to enforce exactly one row // Fetch the updated user

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("User not found or status not updated");
  }

  return data as User;
}

export async function getUserCountByOrgId(
  orgId: string
): Promise<{ count: number; num_of_seat: number }> {
  const { count, error: countError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("org_id", orgId);

  if (countError) {
    throw new Error(countError.message);
  }
  const { data, error: orgError } = await supabase
    .from("organizations")
    .select("num_of_seat")
    .eq("id", orgId)
    .single();

  if (orgError) {
    throw new Error(orgError.message);
  }

  return {
    count: count ?? 0,
    num_of_seat: data.num_of_seat ?? 0,
  };
}

export async function getUserOnboarding(userId: string): Promise<any> {
  const { data, error } = await supabase
    .from("users")

    .select(
      `
      *,
      organizations (
        *,
        subscriptions (
          *
        )
      )
    `
    )
    .eq("user_id", userId)
    .single();

  if (error) {
    console.log("Error fetching onboarding data:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getUsersByOrgId(orgId: string): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select(`
    *,
    users_team(
      *
    )
  `)
    .eq("org_id", orgId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
export async function fetchUsersByTeam(orgId: any, team_id: any): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*, users_team(*)')
    .eq('team_id', team_id)
    .eq('org_id', orgId);


  if (error) {
    throw new Error(error.message);
  }

  return data;
}
