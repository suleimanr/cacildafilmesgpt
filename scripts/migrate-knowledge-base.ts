import { supabase } from "../lib/supabase"

const knowledgeBase = [
  {
    type: "company_info",
    content: `
Cacilda Filmes: Produtora criativa especializada em educação corporativa para grandes empresas.

Sobre nós:
- Usamos design e tecnologia para criar aulas autênticas, funcionais e envolventes.
- Equipe multidisciplinar: fotógrafos, ilustradores, designers, cenógrafos, roteiristas, designers de aprendizagem e gestores de projetos.
- Criamos conteúdos videográficos e instrucionais personalizados.

Nossos serviços:
- Videoaulas
- Vídeos institucionais
- Documentários
- Animações
- Motion Graphics
- Conteúdo para redes sociais

Áreas de atuação:
- Cultura da empresa
- Onboarding
- Liderança
- Empreendedorismo

Diferenciais:
- Especialistas em design, inovação e experiência de aprendizagem
- Controle de qualidade personalizado
- Soluções sob medida
- Abordagem única para cada projeto

Clientes: Grupo Boticário, XP Inc., Magalu, entre outros.

Contato:
- Email: atendimento@cacildafilmes.com
- Telefone: +55 11 3881-2747
- Instagram: @cacildafilmes

Missão: Elevar o padrão da educação corporativa, criando experiências de aprendizagem inspiradoras e eficazes.
    `,
  },
]

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
  // ... (outros vídeos)
]

async function migrateKnowledgeBase() {
  console.log("Iniciando migração da base de conhecimento...")

  try {
    const isConnected = await testSupabaseConnection()
    if (!isConnected) {
      throw new Error("Não foi possível conectar ao Supabase")
    }

    // Limpar tabelas existentes
    await supabase.from("knowledge_base").delete().not("id", "is", null)
    await supabase.from("videos").delete().not("id", "is", null)

    console.log("Tabelas limpas com sucesso")

    // Inserir informações da empresa
    const { data: companyData, error: companyError } = await supabase
      .from("knowledge_base")
      .insert(knowledgeBase)
      .select()

    if (companyError) {
      throw companyError
    }

    console.log("Informações da empresa inseridas com sucesso")

    // Inserir vídeos
    const { data: videosData, error: videosError } = await supabase.from("videos").insert(videos).select()

    if (videosError) {
      throw videosError
    }

    console.log("Vídeos inseridos com sucesso")

    console.log("Migração concluída com sucesso!")
    console.log(`${companyData.length} itens de conhecimento base inseridos`)
    console.log(`${videosData.length} vídeos inseridos`)

    return { companyData, videosData }
  } catch (error) {
    console.error("Erro durante a migração:", error)
    throw error
  }
}

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("knowledge_base").select("*").limit(1)
    return !error
  } catch (error) {
    console.error("Error testing Supabase connection:", error)
    return false
  }
}

// Executar a migração
migrateKnowledgeBase()

