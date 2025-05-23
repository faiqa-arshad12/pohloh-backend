import {supabase} from "../utils/supabaseHelper";

interface KnowledgeCardPayload {
  title: string;
  content?: string;
  category_id: string;
  subcategory_id: string;
  folder_id: string;
  card_owner_id: string;
  team_to_announce_id: string;
  tags?: string[];
  card_owner_verification_date?: string; // ISO string or Date
}

export const createKnowledgeCard = async (payload: any) => {
  const {users, ...cardPayload} = payload;

  // 1. Insert into knowledge_card (with visibility and all other fields, except users)
  const {data: cardData, error: cardError} = await supabase
    .from("knowledge_card")
    .insert([cardPayload])
    .select()
    .single();

  if (cardError) throw new Error(cardError.message);

  // 2. Conditionally insert into user_knowledge_card
  const shouldAddUsers =
    (cardPayload.visibility === "selected_users" ||
      cardPayload.visibility === "team_based") &&
    Array.isArray(users);

  if (shouldAddUsers) {
    const userKnowledgeInserts = users.map((user: any) => ({
      user_id: user.id,
      card_id: cardData.id,
      team_id: user.team_id,
      org_id: user.org_id,
    }));

    const {error: userCardError} = await supabase
      .from("knowledge_card_user_access")
      .insert(userKnowledgeInserts);

    if (userCardError) throw new Error(userCardError.message);
  }

  return cardData;
};

export const updateCardById = async (id: string, payload: any) => {
  console.log(payload, "payload");

  const {users, ...cardPayload} = payload;

  // Fetch existing card first to compare team_access_id if needed
  const {data: existingCard, error: fetchError} = await supabase
    .from("knowledge_card")
    .select("team_access_id, visibility")
    .eq("id", id)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  // --- RULE: If visibility is NOT team_based, clear team_access_id
  if (cardPayload.visibility !== "team_based") {
    cardPayload.team_access_id = null;
  }

  // --- UPDATE the knowledge_card
  const {data: updatedCard, error: updateError} = await supabase
    .from("knowledge_card")
    .update(cardPayload)
    .eq("id", id)
    .select()
    .single();

  if (updateError) throw new Error(updateError.message);

  // Handle visibility-based logic
  const visibility = cardPayload.visibility;

  // Remove all user access for these visibility types
  if (visibility === "only_me" || visibility === "everyone") {
    const {error: deleteError} = await supabase
      .from("knowledge_card_user_access")
      .delete()
      .eq("card_id", id);

    if (deleteError) throw new Error(deleteError.message);
  }

  // If selected_users, replace entries
  if (visibility === "selected_users" && Array.isArray(users)) {
    // 1. Remove old entries
    const {error: deleteOld} = await supabase
      .from("knowledge_card_user_access")
      .delete()
      .eq("card_id", id);

    if (deleteOld) throw new Error(deleteOld.message);

    // 2. Add new entries
    const inserts = users.map((user: any) => ({
      user_id: user.id,
      card_id: id,
      team_id: user.team_id,
      org_id: user.org_id,
    }));

    const {error: insertError} = await supabase
      .from("knowledge_card_user_access")
      .insert(inserts);

    if (insertError) throw new Error(insertError.message);
  }

  // If team_based and team_access_id has changed → update entries
  if (
    visibility === "team_based" &&
    cardPayload.team_access_id &&
    cardPayload.team_access_id !== existingCard.team_access_id
  ) {
    // 1. Remove old entries
    const {error: deleteOld} = await supabase
      .from("knowledge_card_user_access")
      .delete()
      .eq("card_id", id);

    if (deleteOld) throw new Error(deleteOld.message);

    // 2. Insert new entries from users array
    if (Array.isArray(users)) {
      const inserts = users.map((user: any) => ({
        user_id: user.id,
        card_id: id,
        team_id: user.team_id,
        org_id: user.org_id,
      }));

      const {error: insertError} = await supabase
        .from("knowledge_card_user_access")
        .insert(inserts);

      if (insertError) throw new Error(insertError.message);
    }
  }

  return updatedCard;
};

export const fetchCardsbyOrg = async (
  orgId: string,
  userId: string,
  userRole: string
) => {
  console.log(userRole, "user", userId, orgId);
  // If user is owner, fetch all cards in the organization
  if (userRole === "owner") {
    const {data, error} = await supabase
      .from("knowledge_card")
      .select(
        `
        *,
        category_id (*),
        folder_id (*),
        card_owner_id(*),
        org_id(*),
        team_access_id(*),
      `
      )
      .eq("org_id", orgId)
      .order("created_at", {ascending: false});

    if (error) {
      console.error("Error fetching cards:", error);
      return [];
    }
    console.log(data, "aga");
    return data;
  }

  // For non-owner users, fetch cards based on visibility rules
  const {data, error} = await supabase
    .from("knowledge_card")
    .select(
      `
      *,
      category_id (*),
      folder_id (*),
      card_owner_id(*),
      org_id(*),
      team_access_id(*),
      knowledge_card_user_access!inner(*)
    `
    )
    .eq("org_id", orgId)
    .or(
      `visibility.eq.everyone,` + // Cards with visibility 'everyone'
        `and(visibility.eq.only_me,card_owner_id.eq.${userId}),` + // Cards owned by user with 'only_me'
        `and(visibility.eq.selected_users,` + // Cards with 'selected_users' that include this user
        `knowledge_card_user_access.user_id.eq.${userId}),` +
        `and(visibility.eq.team_based,` + // Cards with 'team_based' that include this user
        `knowledge_card_user_access.user_id.eq.${userId})`
    )
    .order("created_at", {ascending: false});

  if (error) {
    console.error("Error fetching cards:", error);
    return [];
  }

  return data;
};
export const deleteByCardId = async (cardId: string) => {
  const {data, error} = await supabase
    .from("knowledge_card")
    .delete()
    .eq("id", cardId);

  if (error) {
    console.error("Error deleting card:", error);
    return null;
  }

  return data;
};
export const findByCardId = async (cardId: string) => {
  const {data, error} = await supabase
    .from("knowledge_card")
    .select(
      `
            *,
            category_id (
                *
            ),
            folder_id (
                *
            ),
            card_owner_id(*),
                        org_id(*),
                        team_to_announce_id(*)


        `
    )
    .eq("id", cardId)
    .single();

  if (error) {
    console.error("Error getting card:", error);
    return null;
  }

  return data;
};
export const fetchUsersByKnowledgeCard = async (cardId) => {
  const {data, error} = await supabase
    .from("knowledge_card_user_access")
    .select(
      `
            *,
            card_id (
                *
            ),
            user_id (
                *
            ),
            team_id(*),
                        org_id(*)


        `
    )
    .eq("card_id", cardId)
    // .eq('card_status', status)
    .order("created_at", {ascending: false});

  if (error) {
    console.error("Error fetching cards:", error);
    return [];
  }

  return data;
};

// export const findByTeamId = async (teamId: string) => {
//   const {data, error} = await supabase
//     .from("knowledge_card")
//     .select(
//       `
//             *,
//             category_id (
//                 *
//             ),
//             folder_id (
//                 *
//             ),
//             card_owner_id(*),
//                         org_id(*),
//                         team_to_announce_id(*)

//         `
//     )
//     .eq("category_id", teamId)
//     .single();

//   if (error) {
//     console.error("Error getting card:", error);
//     return null;
//   }

//   return data;
// };
