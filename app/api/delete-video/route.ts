import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(req: Request) {
  console.log("Iniciando processo de deleção de vídeo")

  try {
    const { id } = await req.json()
    console.log("Tentando deletar vídeo com ID:", id)

    if (!id) {
      console.error("ID do vídeo não fornecido")
      return NextResponse.json({ success: false, message: "ID do vídeo é obrigatório" }, { status: 400 })
    }

    // Determine which table to use based on the environment
    const tableName = process.env.NODE_ENV === "production" ? "videosprod" : "videos"

    // Verificar se o vídeo existe antes de tentar deletar
    console.log(`Verificando existência do vídeo com ID ${id} na tabela ${tableName}`)
    const { data: existingVideo, error: fetchError } = await supabase.from(tableName).select("id").eq("id", id).single()

    if (fetchError) {
      console.error("Erro ao verificar a existência do vídeo:", fetchError)
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao verificar o vídeo",
          error: fetchError.message,
          details: fetchError,
        },
        { status: 500 },
      )
    }

    if (!existingVideo) {
      console.error(`Vídeo não encontrado com o ID ${id} na tabela ${tableName}`)
      return NextResponse.json({ success: false, message: "Vídeo não encontrado" }, { status: 404 })
    }

    console.log("Vídeo encontrado. Prosseguindo com a deleção.")

    // Deletar o vídeo
    const { error: deleteError } = await supabase.from(tableName).delete().eq("id", id)

    if (deleteError) {
      console.error(`Erro ao deletar vídeo do Supabase (tabela ${tableName}):`, deleteError)
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao deletar vídeo",
          error: deleteError.message,
          details: deleteError,
        },
        { status: 500 },
      )
    }

    console.log(`Vídeo deletado com sucesso da tabela ${tableName}. ID:`, id)
    return NextResponse.json({ success: true, message: "Vídeo deletado com sucesso" })
  } catch (error) {
    console.error("Erro inesperado ao deletar vídeo:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro inesperado ao deletar vídeo",
        error: error.message,
        details: error,
      },
      { status: 500 },
    )
  }
}

