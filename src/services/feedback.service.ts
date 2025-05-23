import {supabase} from "../utils/supabaseHelper";

export const createOne = async (payload: any) => {
  const {data, error: insertError} = await supabase
    .from("feedbacks")
    .insert([payload])
    .select();
  if (insertError) {
    throw new Error(insertError.message);}

  return data;
};
