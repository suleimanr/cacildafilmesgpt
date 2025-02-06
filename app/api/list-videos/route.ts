import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getVideoTableName } from "@/lib/supabase"

export async function GET() {
  console.log("Iniciando busca de vídeos")
  try {
    const tableName = getVideoTableName()
    console.log(`Buscando vídeos na tabela: ${tableName}`)

    const { data, error } = await supabase
      .from(tableName)
      .select("id, title, vimeo_id")
      .order("id", { ascending: true })

    if (error) {
      console.error(`Erro ao buscar vídeos da tabela ${tableName}:`, error)
      throw error
    }

    console.log(`Vídeos encontrados na tabela ${tableName}:`, data)
    return NextResponse.json({ success: true, videos: data })
  } catch (error) {
    console.error("Erro ao listar vídeos:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao listar vídeos", error: error.message },
      { status: 500 },
    )
  }
}

