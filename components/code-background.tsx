import type React from "react"
import { useRef, useEffect, useState } from "react"

interface CodeBackgroundProps {
  searchTerm: string
}

interface ContentBlock {
  type: string
  text?: string
  items?: string[]
  videoUrl?: string
  videoTitle?: string
}

const content: ContentBlock[] = [
  {
    type: "title",
    text: "Punch Conteúdo",
  },
  {
    type: "subtitle",
    text: "Transformando o Aprendizado Corporativo",
  },
  {
    type: "paragraph",
    text: "Inovação, tecnologia e criatividade são os pilares da nossa abordagem única.",
  },
  {
    type: "subtitle",
    text: "Quem Somos",
  },
  {
    type: "paragraph",
    text: "A Punch Conteúdo é uma produtora criativa especializada em educação corporativa para grandes empresas. Nosso foco é usar o design e a tecnologia para criar aulas autênticas, funcionais e que realmente prendam a atenção.",
  },
  {
    type: "paragraph",
    text: "Integramos uma equipe multidisciplinar formada por profissionais da publicidade, cinema e criação de conteúdo, incluindo:",
  },
  {
    type: "list",
    items: [
      "Fotógrafos",
      "Ilustradores",
      "Designers",
      "Cenógrafos",
      "Roteiristas",
      "Designers de aprendizagem",
      "Gestores de projetos",
    ],
  },
  {
    type: "paragraph",
    text: "Trabalhamos juntos para criar e produzir conteúdos videográficos e instrucionais sob medida para atender às necessidades específicas de cada cliente, garantindo que cada solução esteja alinhada à cultura e identidade da empresa.",
  },
  {
    type: "subtitle",
    text: "Por que Escolher a Punch?",
  },
  {
    type: "subtitle",
    text: "Inovação e Qualidade Garantida",
  },
  {
    type: "list",
    items: [
      "Especialistas em design, inovação e experiência de aprendizagem.",
      "Controle de qualidade personalizado em cada entrega.",
      "Soluções desenvolvidas sob medida para atender às demandas específicas.",
      "Nada é feito em linha de montagem: cada projeto é único.",
    ],
  },
  {
    type: "subtitle",
    text: "Abordagem Exclusiva",
  },
  {
    type: "list",
    items: [
      "Conteúdo criado a partir do briefing para atender às necessidades reais.",
      "Integração completa com a cultura da empresa.",
      "Equipe de especialistas comprometida com o impacto e a eficiência dos resultados.",
    ],
  },
  {
    type: "subtitle",
    text: "Nossos Serviços",
  },
  {
    type: "paragraph",
    text: "Desenvolvemos conteúdos personalizados para diferentes demandas de educação corporativa:",
  },
  {
    type: "list",
    items: [
      "Cultura da Empresa: Programas para fortalecer os valores e a identidade organizacional.",
      "Onboarding: Materiais para integração e treinamento de novos colaboradores.",
      "Liderança: Cursos para desenvolver habilidades de liderança e gestão.",
      "Empreendedorismo: Conteúdos voltados à inovação e à mentalidade empreendedora.",
    ],
  },
  {
    type: "subtitle",
    text: "Nosso Portfólio",
  },
  {
    type: "paragraph",
    text: "Temos orgulho de atender grandes marcas e criar soluções impactantes para empresas de diferentes setores. Confira alguns dos nossos trabalhos:",
  },
  {
    type: "video",
    text: "XP Inc. - Sonhos",
    videoUrl: "https://player.vimeo.com/video/583171837",
    videoTitle: "XPEED - Sonhos",
  },
  {
    type: "list",
    items: ["Grupo Boticário", "Coca-Cola", "iFood"],
  },
  {
    type: "paragraph",
    text: "A experiência adquirida em projetos desafiadores nos permite entregar conteúdos que equilibram qualidade e inovação, sempre respeitando a identidade de cada cliente.",
  },
  {
    type: "subtitle",
    text: "Nosso Propósito",
  },
  {
    type: "paragraph",
    text: "A Punch veio para elevar o padrão da educação corporativa, criando experiências de aprendizagem que inspiram, engajam e geram resultados reais. Nossa missão é fornecer soluções que combinam criatividade, tecnologia e design para transformar o aprendizado em algo significativo e memorável.",
  },
  {
    type: "subtitle",
    text: "Entre em Contato",
  },
  {
    type: "paragraph",
    text: "Pronto para transformar a educação corporativa da sua empresa? Fale conosco para criar conteúdos que vão muito além do comum.",
  },
]

const CodeBackground: React.FC<CodeBackgroundProps> = ({ searchTerm }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null)

  const highlightSearchTerm = (text: string): React.ReactNode => {
    if (!searchTerm) return text
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const parts = text.split(new RegExp(`(${escapedSearchTerm})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={i} className="bg-yellow-300 text-black">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  const getFilteredContent = () => {
    if (!searchTerm) return []

    const lowercaseSearchTerm = searchTerm.toLowerCase()
    return content.filter(
      (item) =>
        (item.text && item.text.toLowerCase().includes(lowercaseSearchTerm)) ||
        (item.items && item.items.some((listItem) => listItem.toLowerCase().includes(lowercaseSearchTerm))) ||
        (item.videoTitle && item.videoTitle.toLowerCase().includes(lowercaseSearchTerm)),
    )
  }

  const filteredContent = getFilteredContent()

  const handleVideoClick = (videoUrl: string) => {
    setFullscreenVideo(videoUrl)
  }

  const closeFullscreenVideo = () => {
    setFullscreenVideo(null)
  }

  const renderContent = (item: ContentBlock, index: number) => {
    switch (item.type) {
      case "title":
        return (
          <h1 key={index} className="text-4xl font-bold mb-4 text-white">
            {item.text && highlightSearchTerm(item.text)}
          </h1>
        )
      case "subtitle":
        return (
          <h2 key={index} className="text-2xl font-semibold mb-3 text-white">
            {item.text && highlightSearchTerm(item.text)}
          </h2>
        )
      case "paragraph":
        return (
          <p key={index} className="text-lg mb-4 text-white">
            {item.text && highlightSearchTerm(item.text)}
          </p>
        )
      case "list":
        return (
          <ul key={index} className="list-disc list-inside mb-4 text-white">
            {item.items &&
              item.items.map((listItem: string, listIndex: number) => (
                <li key={listIndex} className="text-lg mb-2">
                  {listItem && highlightSearchTerm(listItem)}
                </li>
              ))}
          </ul>
        )
      case "video":
        return (
          <div key={index} className="mb-4">
            <h3
              className="text-xl font-semibold mb-2 text-white cursor-pointer"
              onClick={() => item.videoUrl && handleVideoClick(item.videoUrl)}
            >
              <span className="bg-yellow-300 text-black px-2 py-1 rounded hover:bg-yellow-400 transition-colors">
                {item.text && highlightSearchTerm(item.text)}
              </span>
            </h3>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gray-900 overflow-auto p-8">
      {searchTerm ? (
        <div ref={contentRef} className="max-w-4xl mx-auto">
          {filteredContent.map((item, index) => renderContent(item, index))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-white text-2xl">Digite algo para buscar no conteúdo.</p>
        </div>
      )}
      {fullscreenVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
            <iframe
              src={`${fullscreenVideo}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              className="absolute top-0 left-0 w-full h-full"
              title="Vídeo em tela cheia"
            ></iframe>
            <button
              onClick={closeFullscreenVideo}
              className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeBackground

