import {supabase} from "../utils/supabaseHelper";

export const createLearningPath = async (payload: any) => {
  const {cards, ...newData} = payload;

  // Insert into learning_paths
  const {data: learningPath, error} = await supabase
    .from("learning_paths")
    .insert([newData])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message);
  }

  if (!learningPath) {
    throw new Error("No data returned from insert.");
  }

  // Insert associated cards into card_learning_paths
  if (Array.isArray(cards) && cards.length > 0) {
    const cardLinks = cards.map((card: any) => ({
      card: card || card.id,
      learning_path: learningPath.id,
      org_id: learningPath.org_id,
    }));

    const {error: linkError} = await supabase
      .from("card_learning_paths")
      .insert(cardLinks);

    if (linkError) {
      console.error("Failed to insert card_learning_paths:", linkError);
      throw new Error(linkError.message);
    }
  }

  // Fetch the inserted card_learning_paths with full card data
  const {data: cardLearningPaths, error: fetchError} = await supabase
    .from("card_learning_paths")
    .select("id, card(*), learning_path, org_id")
    .eq("learning_path", learningPath.id);

  if (fetchError) {
    console.error(
      "Failed to fetch card_learning_paths with card data:",
      fetchError
    );
    throw new Error(fetchError.message);
  }

  return {
    learningPath,
    cardLearningPaths,
  };
};

export const fetchLearningPathByOrg = async (orgId: string) => {
  const {data, error} = await supabase
    .from("learning_paths") // ✅ table should be learning_paths not learning-paths
    .select(
      `
              *,

              path_owner (
                  *
              ),
              category(*),
                          org_id(*)


          `
    )
    .eq("org_id", orgId);

  if (error) {
    console.error("error occured while fetching learning paths:", error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No data returned.");
  }

  return data;
};
export const fetchUserLearningPath = async (pathId: string) => {
  const {data, error} = await supabase
    .from("user_learning_path") // ✅ table should be learning_paths not learning-paths
    .select(
      `
                *,
                user_id (
                    *
                ),
                learning_path_id (
                    *
                )



            `
    )
    .eq("learning_path_id", pathId);

  if (error) {
    console.error("error occured while fetching learning paths:", error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No data returned.");
  }

  return data;
};
export const fetchUserEnrolledLearningPaths = async (userId: string) => {
  const {data, error} = await supabase
    .from("user_learning_path") // ✅ table should be learning_paths not learning-paths
    .select(
      `
                  *,
                  user_id (
                      *
                  ),

                  learning_path_id (
                      *,
                      category(*)
                  )



              `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("error occured while fetching learning paths:", error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No data returned.");
  }

  return data;
};

export const fetchLearningPathById = async (pathId: string) => {
  // Fetch the learning path
  const {data: learningPath, error: learningPathError} = await supabase
    .from("learning_paths")
    .select("*, category(*), path_owner(*)")
    .eq("id", pathId)
    .single();

  if (learningPathError) {
    throw new Error(
      `Failed to fetch learning path: ${learningPathError.message}`
    );
  }

  // Fetch associated card_learning_paths with full card data
  const {data: cardLearningPaths, error: cardLearningPathsError} =
    await supabase
      .from("card_learning_paths")
      .select("id, learning_path, org_id, card(*)")
      .eq("learning_path", pathId);

  if (cardLearningPathsError) {
    throw new Error(
      `Failed to fetch associated cards: ${cardLearningPathsError.message}`
    );
  }

  return {
    learningPath,
    cardLearningPaths,
  };
};
export const createLearningByUser = async (payload: any) => {
  // Insert into learning_paths
  const {data: learningPath, error} = await supabase
    .from("user_learning_path")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message);
  }

  if (!learningPath) {
    throw new Error("No data returned from insert.");
  }

  // Insert associated cards into card_learning_paths

  // Fetch the inserted card_learning_paths with full card data
  return learningPath;
};
export const deleteOne = async (pathId: string) => {
  const {data, error} = await supabase
    .from("learning_paths")
    .delete()
    .eq("id", pathId);

  if (error) {
    console.error("Error deleting path:", error);
    throw new Error('Error deleting path:');
  }

  return data;
};
