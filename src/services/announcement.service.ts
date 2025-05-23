import { supabase } from "../utils/supabaseHelper";

export async function fetchSubCategories(teamId) {
    const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('team_id', teamId);

    if (error) {
        console.error('Error:', error);
        return null;
    }

    return data;
}
export const createOne = async (payload: any) => {
    const { teams, ...announcementData } = payload;

    // Step 1: Insert the announcement
    const { data: insertedAnnouncements, error: insertError } = await supabase
        .from('announcements')
        .insert([announcementData])
        .select();

    if (insertError) throw new Error(insertError.message);

    const announcement = insertedAnnouncements[0];

    // Step 2: Create announcement-team mappings
    const announcementTeamMappings = teams.map((teamId: string) => ({
        announcement_id: announcement.id,
        team_id: teamId
    }));

    const { error: mappingError } = await supabase
        .from('announcement_teams')
        .insert(announcementTeamMappings);

    if (mappingError) throw new Error(mappingError.message);

    return announcement;
};
export const getAnnouncementsByTeam = async (team_id: string) => {
    // Get start of today (midnight) in ISO format
    const { data, error } = await supabase
        .from('announcement_teams')
        .select(`
      announcement:announcements (*),
      team:teams (*)
    `)
        .eq('team_id', team_id);

    if (error) throw new Error(error.message);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = data.filter((row: any) => {
        const expiry = row.announcement.expiry_date;
        return !expiry || new Date(expiry) >= today;
    });

    return filtered.map((row: any) => ({
        announcement: row.announcement,
        team: row.team,
    }));
}


export const getAnnouncementsByOrganizations = async (org_id: string) => {
    // Get start of today (midnight) in ISO format
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const { data, error } = await supabase
        .from('announcements')   // fix typo here ('announcements', not 'annoucements')
        .select(`*,
                 card_id(*),
                 user_id(*),
                 org_id(*)`)
        .eq('org_id', org_id)
        .or(`expiry_date.is.null,expiry_date.gte.${todayISO}`);  // filter on expiry_date directly

    if (error) throw new Error(error.message);

    // Since this is direct from announcements, no nested team object here
    return data;
};



export async function updateById(id: string, payload: any): Promise<any> {


    // Step 3: Assign user as lead to the new team
    const { data, error: updateError } = await supabase
        .from("subcategories")
        .update(payload)
        .eq("id", id)

    if (updateError) throw updateError

    return data
}
export async function deleteById(id: string): Promise<any> {


    // Step 3: Assign user as lead to the new team
    const { data, error: updateError } = await supabase
        .from("subcategories")
        .delete()
        .eq('id', id);

    if (updateError) throw updateError

    return data
}