import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"

interface UploadFormProps {
  onClose: () => void
  onSubmit: (data: {
    client: string
    title: string
    production: string
    creation: string
    category: string
    description: string
    vimeoLink: string
  }) => Promise<void>
}

const UploadForm: React.FC<UploadFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    client: "",
    title: "",
    production: "",
    creation: "",
    category: "",
    description: "",
    vimeoLink: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await onSubmit(formData)
      toast.success("Vídeo enviado com sucesso!")
      setFormData({
        client: "",
        title: "",
        production: "",
        creation: "",
        category: "",
        description: "",
        vimeoLink: "",
      })
    } catch (err) {
      console.error("Erro ao enviar o formulário:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao fazer upload")
      toast.error("Ocorreu um erro ao adicionar o vídeo. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-2xl relative my-4 sm:my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>

          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white pr-8">Adicionar Novo Vídeo</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 bg-red-100 p-3 rounded-md text-sm">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="client" className="text-white text-sm">
                  Cliente
                </Label>
                <Input
                  id="client"
                  name="client"
                  type="text"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="Nome do cliente"
                  required
                  className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-white text-sm">
                  Título
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Título do vídeo"
                  required
                  className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="production" className="text-white text-sm">
                  Produção
                </Label>
                <Input
                  id="production"
                  name="production"
                  type="text"
                  value={formData.production}
                  onChange={handleChange}
                  placeholder="Equipe de produção"
                  required
                  className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creation" className="text-white text-sm">
                  Criação
                </Label>
                <Input
                  id="creation"
                  name="creation"
                  type="text"
                  value={formData.creation}
                  onChange={handleChange}
                  placeholder="Equipe de criação"
                  required
                  className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-white text-sm">
                  Categoria
                </Label>
                <Input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Categoria do vídeo"
                  required
                  className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vimeoLink" className="text-white text-sm">
                  Link do Vimeo
                </Label>
                <Input
                  id="vimeoLink"
                  name="vimeoLink"
                  type="text"
                  value={formData.vimeoLink}
                  onChange={handleChange}
                  placeholder="https://vimeo.com/..."
                  required
                  className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white text-sm">
                Descrição
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição do vídeo"
                required
                className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 min-h-[100px] text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UploadForm

