import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { type, content } = await req.json()

    if (!type || !content) {
      return NextResponse.json({ success: false, message: "Tipo e conteúdo são obrigatórios" }, { status: 400 })
    }

    const tableName = process.env.NODE_ENV === "production" ? "knowledge_base_prod" : "knowledge_base"

    const { data, error } = await supabase.from(tableName).insert([{ type, content }]).select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Base de conhecimento atualizada com sucesso",
      data,
    })
  } catch (error) {
    console.error("Erro ao atualizar a base de conhecimento:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao atualizar a base de conhecimento",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

