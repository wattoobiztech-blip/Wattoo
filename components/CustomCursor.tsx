'use client'

import { useEffect, useState, useRef } from 'react'

interface CursorPosition {
  x: number
  y: number
}

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState<CursorPosition>({ x: 0, y: 0 })
  const [trailPositions, setTrailPositions] = useState<CursorPosition[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ])
  const animationRef = useRef<number>()

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const animateTrail = () => {
      setTrailPositions(prev => {
        const newPositions = [...prev]
        // Each trail circle follows the previous one with a delay
        newPositions[0] = {
          x: newPositions[0].x + (mousePosition.x - newPositions[0].x) * 0.3,
          y: newPositions[0].y + (mousePosition.y - newPositions[0].y) * 0.3
        }
        newPositions[1] = {
          x: newPositions[1].x + (newPositions[0].x - newPositions[1].x) * 0.2,
          y: newPositions[1].y + (newPositions[0].y - newPositions[1].y) * 0.2
        }
        newPositions[2] = {
          x: newPositions[2].x + (newPositions[1].x - newPositions[2].x) * 0.15,
          y: newPositions[2].y + (newPositions[1].y - newPositions[2].y) * 0.15
        }
        return newPositions
      })
      animationRef.current = requestAnimationFrame(animateTrail)
    }

    window.addEventListener('mousemove', updateMousePosition)
    animationRef.current = requestAnimationFrame(animateTrail)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition])

  return (
    <>
      {/* Trailing circles effect */}
      <div className="fixed pointer-events-none z-50">
        {trailPositions.map((pos, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-teal-400/20 to-emerald-400/20 blur-sm cursor-trail"
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
              width: `${16 - i * 2}px`,
              height: `${16 - i * 2}px`,
              opacity: 0.8 - i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Global styles for ripple effects */}
      <style jsx global>{`
        button, a, [role="button"] {
          position: relative;
          overflow: hidden;
        }

        button:hover::after, 
        a:hover::after, 
        [role="button"]:hover::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent);
          transform: translate(-50%, -50%);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }

        @keyframes ripple {
          to {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }

        /* Subtle glow on interactive elements */
        button:hover,
        a:hover,
        [role="button"]:hover {
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.2);
        }

        /* Performance optimization */
        .cursor-trail {
          will-change: transform;
        }
      `}</style>
    </>
  )
}