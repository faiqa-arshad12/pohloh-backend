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
    const { data, error } = await supabase
        .from('subcategories')
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
      .from("subcategories")
      .update(payload)
      .eq("id", id)

  if (updateError) throw updateError

  return data
}
export async function deleteById(id: string): Promise<any> {
  // Step 1: Delete knowledge cards linked to the subcategory
  const { error: deleteCardsError } = await supabase
    .from("knowledge_card")
    .delete()
    .eq("folder_id", id);

  if (deleteCardsError) throw deleteCardsError;

  // Step 2: Delete the subcategory
  const { data, error: deleteSubcatError } = await supabase
    .from("subcategories")
    .delete()
    .eq("id", id);

  if (deleteSubcatError) throw deleteSubcatError;

  return data;
}
