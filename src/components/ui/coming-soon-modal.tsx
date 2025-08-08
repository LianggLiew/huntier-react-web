'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  featureName: string
  dictionary?: any
}

export function ComingSoonModal({ 
  isOpen, 
  onClose, 
  featureName,
  dictionary 
}: ComingSoonModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-sm bg-black/50' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-gray-900 rounded-lg p-8 max-w-md mx-4 relative transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {dictionary?.comingSoon?.title || 'Coming Soon!'}
          </h2>
          
          <p className="text-gray-300 mb-6">
            {dictionary?.comingSoon?.description?.replace('{feature}', featureName) || 
             `The ${featureName} feature is currently under development and will be available soon.`}
          </p>
          
          <Button 
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
          >
            {dictionary?.comingSoon?.action || 'Got it!'}
          </Button>
        </div>
      </div>
    </div>
  )
}