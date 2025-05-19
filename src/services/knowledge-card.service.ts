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
  console.log(payload, "payload");
  const {data, error} = await supabase
    .from("knowledge_card")
    .insert([
      {
        ...payload,
      },
    ])
    .select();

  if (error) throw new Error(error.message);

  return data;
};
export const updateCardById = async (id: string, payload: any) => {
  console.log(payload, "payload");
  const {data, error} = await supabase
    .from("knowledge_card")
    .update({
      ...payload,
    })
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);

  return data;
};
export const fetchCardsbyOrg = async (orgId) => {
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
                        org_id(*)


        `
    )
    .eq("org_id", orgId)
    // .eq('card_status', status)
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
