'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeartButtonProps {
  className?: string
  iconClassName?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'icon' | 'rounded'
  srText?: string
  defaultLiked?: boolean
  onToggle?: (liked: boolean) => void
}

export function HeartButton({
  className,
  iconClassName,
  size = 'md',
  variant = 'ghost',
  srText = 'Save job',
  defaultLiked = false,
  onToggle
}: HeartButtonProps) {
  const [liked, setLiked] = useState(defaultLiked)

  // Size mappings
  const sizeMap = {
    sm: {
      button: 'h-6 w-6',
      icon: 'h-3.5 w-3.5'
    },
    md: {
      button: 'h-8 w-8',
      icon: 'h-4 w-4'
    },
    lg: {
      button: 'h-10 w-10',
      icon: 'h-5 w-5'
    }
  }

  // Variant mappings
  const variantMap = {
    ghost: 'rounded-full bg-transparent hover:bg-white/20',
    icon: 'rounded-full',
    rounded: 'rounded-full'
  }

  const handleClick = () => {
    const newLiked = !liked
    setLiked(newLiked)
    
    // Get a reference to the button element
    const button = document.activeElement as HTMLElement
    if (button) {
      // Create ripple effect
      const ripple = document.createElement('span')
      ripple.style.position = 'absolute'
      ripple.style.borderRadius = '50%'
      ripple.style.transform = 'scale(0)'
      ripple.style.backgroundColor = newLiked ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.3)'
      ripple.style.width = '120%'
      ripple.style.height = '120%'
      ripple.style.top = '-10%'
      ripple.style.left = '-10%'
      ripple.style.animation = 'heart-pop 0.6s ease-out forwards'
      ripple.style.pointerEvents = 'none'
      ripple.style.zIndex = '-1'
      
      // Clear any existing ripples
      const existingRipples = button.querySelectorAll('.heart-ripple')
      existingRipples.forEach(el => el.remove())
      
      ripple.className = 'heart-ripple'
      button.appendChild(ripple)
      
      // When liking, create floating heart particles and confetti
      if (newLiked) {
        // Create multiple small floating hearts
        for (let i = 0; i < 5; i++) {
          const heartParticle = document.createElement('span')
          heartParticle.className = 'heart-particle'
          
          // Randomize direction and rotation
          const tx = (Math.random() * 60) - 30 // -30px to 30px
          const r = (Math.random() * 60) - 30 // -30deg to 30deg
          heartParticle.style.setProperty('--tx', `${tx}px`)
          heartParticle.style.setProperty('--r', `${r}deg`)
          
          // Randomize size
          const scale = 0.5 + Math.random() * 0.5 // 0.5 to 1
          heartParticle.style.transform = `scale(${scale})`
          
          // Randomize animation duration
          const duration = 0.6 + Math.random() * 0.4 // 0.6s to 1s
          heartParticle.style.animationDuration = `${duration}s`
          
          button.appendChild(heartParticle)
          
          // Remove particle after animation completes
          setTimeout(() => {
            heartParticle.remove()
          }, duration * 1000)
        }
        
        // Add confetti blast effect (especially nice for featured jobs)
        const confettiColors = [
          '#ec4899', // pink
          '#f472b6', // lighter pink
          '#fb7185', // rose
          '#fcd34d', // amber
          '#22c55e'  // emerald
        ]
        
        // Create confetti particles
        for (let i = 0; i < 12; i++) {
          const confetti = document.createElement('span')
          confetti.className = 'confetti-particle'
          
          // Get random color from our palette
          confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)]
          
          // Randomize direction, distance and rotation
          const tx = (Math.random() * 100) - 50 // -50px to 50px for x
          const ty = (Math.random() * 100) - 50 // -50px to 50px for y
          const r = Math.random() * 360 // 0-360 degrees rotation
          confetti.style.setProperty('--tx', `${tx}px`)
          confetti.style.setProperty('--ty', `${ty}px`)
          confetti.style.setProperty('--r', `${r}deg`)
          
          // Randomize size
          const scale = 0.5 + Math.random() * 0.5
          confetti.style.transform = `scale(${scale})`
          
          // Randomize animation duration
          const duration = 0.8 + Math.random() * 0.6 // 0.8s to 1.4s
          confetti.style.animationDuration = `${duration}s`
          
          button.appendChild(confetti)
          
          // Remove confetti after animation completes
          setTimeout(() => {
            confetti.remove()
          }, duration * 1000)
        }
        
        // Add tactile feedback if available
        if ('vibrate' in navigator) {
          try {
            navigator.vibrate(50) // gentle haptic feedback for 50ms
          } catch (e) {
            // Ignore errors if vibration is not supported
          }
        }
      }
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove()
      }, 600)
    }
    
    if (onToggle) {
      onToggle(newLiked)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={cn(
        sizeMap[size].button,
        variantMap[variant],
        'heart-icon-container relative',
        liked && 'liked',
        className
      )}
      onClick={handleClick}
      aria-pressed={liked}
      aria-label={liked ? 'Remove from saved' : srText}
    >
      <Heart 
        className={cn(
          sizeMap[size].icon,
          'heart-icon transition-all duration-300',
          liked ? 'active fill-rose-500 text-rose-500' : 'text-rose-500 opacity-70 hover:opacity-100',
          iconClassName
        )} 
        fill={liked ? 'currentColor' : 'none'}
        strokeWidth={liked ? 1.5 : 2} 
      />
      <span className="sr-only">{liked ? 'Remove from saved' : srText}</span>
    </Button>
  )
}
