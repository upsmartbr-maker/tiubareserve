import { supabase } from "./supabaseClient";

export async function uploadProductImage(file: File, pathPrefix = "products"): Promise<string | null> {
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${pathPrefix}/${Date.now()}-${cleanFileName}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erro no upload para o Supabase Storage:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Erro inesperado no upload:", err);
    return null;
  }
}
