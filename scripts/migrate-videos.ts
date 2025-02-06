import { supabase } from "../lib/supabase"

async function checkVideosTable() {
  console.log("Iniciando verificação da tabela de vídeos...")

  try {
    // Verifica o número de vídeos na tabela
    const { count, error: countError } = await supabase.from("videos").select("*", { count: "exact", head: true })

    if (countError) {
      throw countError
    }

    console.log(`Número de vídeos na tabela: ${count}`)
    console.log("Nenhuma migração ou modificação automática será realizada.")
    console.log("A tabela de vídeos só pode ser modificada pelo usuário através da interface.")
  } catch (error) {
    console.error("Erro durante a verificação da tabela de vídeos:", error)
  }
}

// Executa a verificação
checkVideosTable()

