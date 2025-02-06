import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  console.log("API /api/upload-video called")
  try {
    const { client, title, production, creation, category, description, vimeoLink } = await req.json()

    console.log("Received data:", { client, title, production, creation, category, description, vimeoLink })

    // Extract Vimeo ID from the link
    const vimeoId = vimeoLink.split("/").pop()

    // Determine which table to use based on the environment
    const tableName = process.env.NODE_ENV === "production" ? "videosprod" : "videos"

    // Insert the new video into Supabase
    const { data, error } = await supabase.from(tableName).insert([
      {
        vimeo_id: vimeoId,
        title,
        client,
        production,
        creation,
        category,
        description,
      },
    ])

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    console.log(`Vídeo adicionado com sucesso à tabela ${tableName}:`, { vimeoId, title, category })

    return NextResponse.json({ success: true, message: "Vídeo adicionado com sucesso" })
  } catch (error) {
    console.error("Detailed error in /api/upload-video:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao processar o upload", error: error.message },
      { status: 500 },
    )
  }
}

