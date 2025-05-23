import { supabase } from "../utils/supabaseHelper";
import { createOrUpdateSubscription } from "./subscription.service";
import { updateUser } from "./users.service";


interface Organization {
  id: string;
  name: string;
  departments: string[];
  num_of_seat: number;
  created_at: string;
  user_id: string;
  updated_at: string;
}

interface CreateOrganizationData {
  user_id: string;
  organization: any; // Replace 'any' with proper interface
  user: any; // Replace 'any' with proper interface
  subscription: any; // Replace 'any' with proper interface
}


export async function createOrganization(
  data: CreateOrganizationData
): Promise<{
  organization: Organization[];
  user?: any;
  subscription?: any;
}> {
  try {
    const { user_id, organization, user, subscription } = data;
    let orgId: string;

    const organizationData = {
      ...organization,
      user_id,
    };
    const { data: userData, error: userError } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", user_id)
      .single();
    console.log(user, 'user')

    // 1. Check if organization already exists for this user
    const { data: existingOrg, error: fetchError } = await supabase
      .from("organizations")
      .select("*")
      .eq("user_id", user_id)
      .single();

    let organizationResult: Organization[];

    if (fetchError && fetchError.code !== "PGRST116") {
      throw new Error(`Failed to fetch organization: ${fetchError.message}`);
    }

    // 2. Create or update organization
    if (existingOrg) {
      const { data: updatedOrg, error: updateError } = await supabase
        .from("organizations")
        .update(organizationData)
        .eq("user_id", user_id)
        .select();

      if (updateError) {
        throw new Error(`Failed to update organization: ${updateError.message}`);
      }

      if (!updatedOrg || updatedOrg.length === 0) {
        throw new Error("Organization update failed: No data returned");
      }

      organizationResult = updatedOrg as Organization[];
      orgId = updatedOrg[0].id;
    } else {
      const { data: newOrg, error: insertError } = await supabase
        .from("organizations")
        .insert([organizationData])
        .select();

      if (insertError) {
        throw new Error(`Failed to create organization: ${insertError.message}`);
      }

      if (!newOrg || newOrg.length === 0) {
        throw new Error("Failed to create organization: No data returned");
      }

      organizationResult = newOrg as Organization[];
      orgId = newOrg[0].id;
    }

    // 3. Create or update teams from departments
    if (Array.isArray(organization.departments) && organization.departments.length > 0) {
      const { data: existingTeams, error: fetchTeamsError } = await supabase
        .from("teams")
        .select("id, name")
        .eq("org_id", orgId);

      if (fetchTeamsError) {
        console.error("Failed to fetch existing teams:", fetchTeamsError.message);
      } else {
        const existingMap = new Map(
          (existingTeams || []).map((team) => [team.name.toLowerCase(), team.id])
        );

        const teamsToInsert = [];
        const teamsToUpdate = [];

        for (const deptName of organization.departments) {
          const baseData = {
            name: deptName,
            org_id: orgId,
            // image: null, // Add your logic or default here
            // team_lead: null,
          };

          const existingId = existingMap.get(deptName.toLowerCase());
          if (existingId) {
            teamsToUpdate.push({ id: existingId, ...baseData });
          } else {
            teamsToInsert.push(baseData);
          }
        }

        if (teamsToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from("teams")
            .insert(teamsToInsert);

          if (insertError) {
            console.error("Failed to insert new teams:", insertError.message);
          }
        }

        for (const team of teamsToUpdate) {
          const { error: updateError } = await supabase
            .from("teams")
            .update({
              name: team.name,
              image: team.image,
              team_lead: team.team_lead,
            })
            .eq("id", team.id);

          if (updateError) {
            console.error(`Failed to update team "${team.name}":`, updateError.message);
          }
        }
      }
    }

    // 4. Create or update subscription
    const newSubscription = await createOrUpdateSubscription({
      customer_id: subscription.customer_id,
      subscription_id: subscription.subscription_id,
      org_id: orgId,
      is_subscribed: subscription.is_subscribed,
      plan_type: subscription.plan_type,
    });

    // 5. Update user with org_id
    const updatedUser = await updateUser(user_id, {
      ...user,
      org_id: orgId,
      status: "complete",
    });

    return {
      organization: organizationResult,
      user: updatedUser,
      subscription: newSubscription,
    };
  } catch (err) {
    console.error("Error in createOrganization:", err);
    throw err;
  }
}


// Fetch all organizations
export async function getOrganizations(): Promise<Organization[]> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*');

  if (error) throw error;
  return data as Organization[];  // Type the result as Organization array
}


export async function getOrganizationById(id: string): Promise<Organization> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('user_id', id)  // or 'org_id' if using UUID from your example
    .single();

  if (error) throw error;
  return data as Organization;
}


export const updateOrganizations = async (
  id: string,
  updates: Partial<Organization>
): Promise<Organization> => {
  // 1. Update the organization record
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (orgError) throw new Error(orgError.message);

  // 2. If departments are included in updates, sync them with the 'teams' table
  // if (Array.isArray(updates.departments)) {
  //   // Fetch existing teams under this org
  //   const { data: existingTeams, error: fetchTeamsError } = await supabase
  //     .from("teams")
  //     .select("id, name")
  //     .eq("org_id", id);

  //   if (fetchTeamsError) {
  //     console.error("Failed to fetch existing teams:", fetchTeamsError.message);
  //   } else {
  //     const existingMap = new Map(
  //       (existingTeams || []).map((team) => [team.name.toLowerCase(), team.id])
  //     );

  //     // Track which teams should be kept
  //     const departmentsLowerCase = new Set(
  //       updates.departments.map(dept => dept.toLowerCase())
  //     );

  //     // Identify teams to insert, update, or delete
  //     const teamsToInsert = [];
  //     const teamsToUpdate = [];
  //     const teamsToDelete = [];

  //     // Find teams to update or insert
  //     for (const deptName of updates.departments) {
  //       const baseData = {
  //         name: deptName,
  //         org_id: id,
  //       };

  //       const existingId = existingMap.get(deptName.toLowerCase());

  //       if (existingId) {
  //         teamsToUpdate.push({ id: existingId, ...baseData });
  //       } else {
  //         teamsToInsert.push(baseData);
  //       }
  //     }

  //     // Find teams to delete (teams that exist but aren't in the updated departments)
  //     for (const team of existingTeams || []) {
  //       if (!departmentsLowerCase.has(team.name.toLowerCase())) {
  //         teamsToDelete.push(team.id);
  //       }
  //     }

  //     // Insert new teams
  //     if (teamsToInsert.length > 0) {
  //       const { error: insertError } = await supabase
  //         .from("teams")
  //         .insert(teamsToInsert);

  //       if (insertError) {
  //         console.error("Failed to insert new teams:", insertError.message);
  //       }
  //     }

  //     // Update existing teams
  //     for (const team of teamsToUpdate) {
  //       const { error: updateError } = await supabase
  //         .from("teams")
  //         .update({
  //           name: team.name,
  //         })
  //         .eq("id", team.id);

  //       if (updateError) {
  //         console.error(`Failed to update team "${team.name}":`, updateError.message);
  //       }
  //     }

  //     // Delete teams that are no longer in departments
  //     if (teamsToDelete.length > 0) {
  //       const { error: deleteError } = await supabase
  //         .from("teams")
  //         .delete()
  //         .in("id", teamsToDelete);

  //       if (deleteError) {
  //         console.error("Failed to delete teams:", deleteError.message);
  //       }
  //     }
  //   }
  // }

  return orgData as Organization;
};

