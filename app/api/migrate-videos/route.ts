import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const videos = [
  {
    vimeo_id: "754713544",
    title: "Reel",
    category: "portfolio",
    description: "Reel da Cacilda Filmes",
  },
  {
    vimeo_id: "774771860",
    title: "Grupo Boticário - NPS",
    category: "corporativo",
    description: "Vídeo institucional para o Grupo Boticário",
  },
  {
    vimeo_id: "844245615",
    title: "Empreendedoras da Beleza",
    category: "corporativo",
    description: "Documentário sobre empreendedorismo feminino",
  },
  {
    vimeo_id: "835540097",
    title: "Making of Empreendedoras da Beleza",
    category: "making-of",
    description: "Bastidores do documentário Empreendedoras da Beleza",
  },
  {
    vimeo_id: "690648788",
    title: "XP Inc. Entrevista Benchimol",
    category: "entrevista",
    description: "Entrevista com Guilherme Benchimol da XP Inc.",
  },
  {
    vimeo_id: "583171837",
    title: "Sonhos – XP Inc.",
    category: "corporativo",
    description: "Vídeo institucional para XP Inc.",
  },
  {
    vimeo_id: "583177882",
    title: "Teaser Videoaula XP Inc.",
    category: "educacional",
    description: "Teaser de videoaula para XP Inc.",
  },
  {
    vimeo_id: "773937228",
    title: "Making of Empreendedoras da Beleza 2021",
    category: "making-of",
    description: "Bastidores do projeto Empreendedoras da Beleza 2021",
  },
  {
    vimeo_id: "396761756",
    title: "Institucional Pedreira DoValle",
    category: "institucional",
    description: "Vídeo institucional para Pedreira DoValle",
  },
  {
    vimeo_id: "462809411",
    title: "É PRA TUDO - Consórcio Magalu",
    category: "comercial",
    description: "Campanha para Consórcio Magalu",
  },
  {
    vimeo_id: "768517393",
    title: "Grupo Boticário - Centralidade",
    category: "corporativo",
    description: "Vídeo sobre centralidade para Grupo Boticário",
  },
  {
    vimeo_id: "690652997",
    title: "Making of Consórcio Magalu",
    category: "making-of",
    description: "Bastidores da campanha do Consórcio Magalu",
  },
  {
    vimeo_id: "510694841",
    title: "Black Friday Lojas Marabraz",
    category: "comercial",
    description: "Campanha Black Friday para Lojas Marabraz",
  },
]

export async function GET() {
  console.log("Iniciando migração dos vídeos...")

  try {
    const isConnected = await testSupabaseConnection()
    if (!isConnected) {
      throw new Error("Não foi possível conectar ao Supabase")
    }

    // Primeiro, limpa a tabela existente
    const { error: deleteError } = await supabase.from("videos").delete().not("id", "is", null)

    if (deleteError) {
      throw deleteError
    }

    console.log("Tabela limpa com sucesso")

    // Insere os novos vídeos
    const { data, error } = await supabase.from("videos").insert(videos).select()

    if (error) {
      throw error
    }

    console.log("Migração concluída com sucesso!")
    console.log(`${data.length} vídeos inseridos:`)
    console.log(JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true, message: "Migração concluída com sucesso", data })
  } catch (error) {
    console.error("Erro durante a migração:", error)
    let errorMessage = "Erro desconhecido"
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === "object" && error !== null) {
      errorMessage = JSON.stringify(error)
    }
    return NextResponse.json(
      {
        success: false,
        message: "Erro durante a migração",
        error: errorMessage,
        fullError: error,
      },
      { status: 500 },
    )
  }
}

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("videos").select("*").limit(1)
    return !error
  } catch (error) {
    console.error("Error testing Supabase connection:", error)
    return false
  }
}

