import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateData() {
  try {
    const dataDir = path.join(process.cwd(), "data")
    const knowledgeBasePath = path.join(dataDir, "knowledge-base.json")

    if (!fs.existsSync(knowledgeBasePath)) {
      console.log("Arquivo knowledge-base.json não encontrado. Nenhum dado para migrar.")
      return
    }

    const data = fs.readFileSync(knowledgeBasePath, "utf8")
    const videos = JSON.parse(data)

    for (const video of videos) {
      const { data, error } = await supabase.from("videos").insert({
        vimeo_id: video.id,
        title: video.title,
        category: video.category,
        description: video.description,
      })

      if (error) {
        console.error(`Erro ao inserir vídeo ${video.id}:`, error)
      } else {
        console.log(`Vídeo ${video.id} migrado com sucesso.`)
      }
    }

    console.log("Migração concluída.")
  } catch (error) {
    console.error("Erro durante a migração:", error)
  }
}

migrateData()

