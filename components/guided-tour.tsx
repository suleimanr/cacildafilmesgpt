import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const tourSteps = [
  {
    target: 'header',
    content: 'Navegue facilmente pelo site usando nosso menu intuitivo.'
  },
  {
    target: 'hero',
    content: 'Descubra como a Punch Conteúdo está transformando a educação corporativa.'
  },
  {
    target: 'diferenciais',
    content: 'Conheça nossos diferenciais que nos tornam únicos no mercado.'
  },
  {
    target: 'testimonials',
    content: 'Veja o que nossos clientes dizem sobre nós.'
  },
  {
    target: 'blog',
    content: 'Fique por dentro das últimas tendências em educação corporativa em nosso blog.'
  },
  {
    target: 'contato',
    content: 'Entre em contato conosco para saber mais sobre nossos serviços.'
  }
]

interface GuidedTourProps {
  onComplete: () => void
}

export default function GuidedTour({ onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      >
        <div className="bg-white text-black p-8 rounded-lg max-w-md">
          <h3 className="text-2xl font-bold mb-4">Bem-vindo à Punch Conteúdo!</h3>
          <p className="mb-6">{tourSteps[currentStep].content}</p>
          <div className="flex justify-between">
            <button
              onClick={onComplete}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Pular tour
            </button>
            <button
              onClick={nextStep}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {currentStep < tourSteps.length - 1 ? 'Próximo' : 'Finalizar'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

