"use client"

import React, { useEffect, useRef, useState } from 'react'

interface AnimatedBackgroundProps {
  children?: React.ReactNode
  className?: string
  intensity?: number
  speed?: number
  colorStart?: string
  colorEnd?: string
}

export function AnimatedBackground({ 
  children, 
  className = '',
  intensity = 5,
  speed = 3,
  colorStart = 'rgba(16, 185, 129, 0.15)', 
  colorEnd = 'rgba(10, 10, 10, 0)'
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [cursorPoints, setCursorPoints] = useState<{x: number, y: number, age: number, opacity: number}[]>([])
  const requestRef = useRef<number | undefined>(undefined)
  const prevTimeRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      
      setMousePosition({ x, y })
      
      // Add a new point to the trail
      setCursorPoints(prev => [
        ...prev,
        { x, y, age: 0, opacity: 1.0 }
      ].slice(-20)) // Keep only the last 20 points
    }
    
    const handleMouseEnter = () => {
      setIsHovering(true)
    }
    
    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])
  
  // Animation loop for points aging
  const animate = (time: number) => {
    if (prevTimeRef.current !== undefined) {
      const deltaTime = time - prevTimeRef.current
      
      setCursorPoints(prev => 
        prev
          .map(point => ({
            ...point,
            age: point.age + deltaTime * 0.001 * speed,
            opacity: Math.max(0, 1 - point.age * 0.5 * speed)
          }))
          .filter(point => point.opacity > 0)
      )
    }
    
    prevTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(time => animate(time))
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [speed])

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${className}`}
    >
      {/* Main cursor gradient */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{ 
          opacity: isHovering ? 1 : 0,
          background: isHovering 
            ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${colorStart} 0%, ${colorEnd} ${70 - intensity * 5}%)` 
            : 'none',
          transition: 'background 0.6s ease' 
        }}
      />
      
      {/* Trail effect */}
      {cursorPoints.map((point, index) => (
        <div
          key={index}
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: point.opacity * 0.3,
            background: `radial-gradient(circle at ${point.x}% ${point.y}%, ${colorStart} 0%, ${colorEnd} ${50 - intensity * 4}%)`,
            transition: 'opacity 0.5s ease'
          }}
        />
      ))}
      
      {children}
    </div>
  )
}
