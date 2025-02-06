import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getVideoTableName() {
  return process.env.NODE_ENV === "production" ? "videosprod" : "videos"
}

export async function testSupabaseConnection() {
  try {
    const tableName = getVideoTableName()
    const { data, error } = await supabase.from(tableName).select("count", { count: "exact" })
    if (error) throw error
    console.log(`Conexão com Supabase bem-sucedida. Contagem de vídeos na tabela ${tableName}:`, data)
    return true
  } catch (error) {
    console.error("Falha na conexão com Supabase:", error)
    return false
  }
}

