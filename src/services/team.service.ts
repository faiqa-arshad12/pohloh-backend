import { supabase } from "../utils/supabaseHelper";
export async function fetchTeamsByOrgId(id: string): Promise<any> {
    try {
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .eq('org_id', id);

        if (error) throw error;
        return data;
    } catch (err) {
        throw err;
    }
}
export async function fetchTeamById(id: string): Promise<any> {
    try {
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .eq('id', id).single()
            ;
        if (error) throw error;
        return data;
    } catch (err) {
        throw err;
    }
}

export async function updateTeam(id: string, payload: any): Promise<any> {
    const newLeadId = payload.lead_id

    if (!newLeadId) {
        throw new Error("No team_lead specified in payload.")
    }

    // Step 1: Check if this user is already a lead of any team
    const { data: existingTeams, error: fetchError } = await supabase
        .from("teams")
        .select("id")
        .eq("lead_id", newLeadId)

    if (fetchError) throw fetchError

    // Step 2: Remove the user as lead from any other teams
    if (existingTeams && existingTeams.length > 0) {
        const teamIdsToUpdate = existingTeams.map((team) => team.id)

        const { error: removeError } = await supabase
            .from("teams")
            .update({ lead_id: null, user_id: null })
            .in("id", teamIdsToUpdate)

        if (removeError) throw removeError
    }

    // Step 3: Assign user as lead to the new team
    const { data, error: updateError } = await supabase
        .from("teams")
        .update(payload)
        .eq("id", id)

    if (updateError) throw updateError

    return data
}


export async function fetchTeamsCategByOrgId(orgId: string): Promise<any[]> {
    try {
        const { data, error } = await supabase
            .from('teams')
            .select(`
               *,
                subcategories (
                    id,
                    name,
                    knowledge_card (
                        *,
                        card_owner_id(*)
                    )
                )
            `)
            .eq('org_id', orgId);

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Error fetching teams by orgId:', err);
        throw err;
    }
}

// Type definitions
export const createOne = async (payload: any) => {
    console.log(payload, 'payload')
    const { data, error } = await supabase
        .from('teams')
        .insert([
            {
                ...payload
            }
        ])
        .select();

    if (error) throw new Error(error.message);

    return data;
};
export async function updateById(id: string, payload: any): Promise<any> {


    // Step 3: Assign user as lead to the new team
    const { data, error: updateError } = await supabase
        .from("teams")
        .update(payload)
        .eq("id", id)

    if (updateError) throw updateError

    return data
}
export async function deleteById(id: string): Promise<any> {
    // Step 1: Get all subcategories for the team
    const { data: subcategories, error: subcatError } = await supabase
      .from("subcategories")
      .select("id")
      .eq("team_id", id);

    if (subcatError) throw subcatError;

    const subcategoryIds = subcategories.map((sc: any) => sc.id);

    // Step 2: Delete all knowledge cards linked to those subcategories
    if (subcategoryIds.length > 0) {
      const { error: deleteCardsError } = await supabase
        .from("knowledge_card")
        .delete()
        .in("folder_id", subcategoryIds);

      if (deleteCardsError) throw deleteCardsError;

      // Step 3: Delete the subcategories
      const { error: deleteSubcatsError } = await supabase
        .from("subcategories")
        .delete()
        .in("id", subcategoryIds);

      if (deleteSubcatsError) throw deleteSubcatsError;
    }

    // Step 4: Delete the team
    const { data, error: deleteTeamError } = await supabase
      .from("teams")
      .delete()
      .eq("id", id);

    if (deleteTeamError) throw deleteTeamError;

    return data;
  }
