'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SectionProps {
  children: React.ReactNode
  isActive: boolean
  index: number
  total: number
}

export default function Section({ children, isActive, index }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && sectionRef.current) {
      sectionRef.current.style.opacity = '0'
      sectionRef.current.style.transform = 'translateY(20px)'
      
      const timer = setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          sectionRef.current.style.opacity = '1'
          sectionRef.current.style.transform = 'translateY(0)'
        }
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [isActive])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.section
          ref={sectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden={!isActive}
        >
          {children}
        </motion.section>
      )}
    </AnimatePresence>
  )
}

