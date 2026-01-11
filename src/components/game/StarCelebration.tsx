import { useState, useEffect } from 'react'

interface StarCelebrationProps {
  wrongGuesses: number
  onAnimationComplete: () => void
}

function getStarColor(wrongGuesses: number): string {
  if (wrongGuesses === 0) return '#D4AF37'
  if (wrongGuesses <= 2) return '#22C55E'
  if (wrongGuesses <= 4) return '#F97316'
  return '#EF4444'
}

function getStarGradient(wrongGuesses: number): { start: string; mid: string; end: string } {
  if (wrongGuesses === 0) {
    return { start: '#F5E6A3', mid: '#D4AF37', end: '#996515' }
  }
  if (wrongGuesses <= 2) {
    return { start: '#86EFAC', mid: '#22C55E', end: '#15803D' }
  }
  if (wrongGuesses <= 4) {
    return { start: '#FDBA74', mid: '#F97316', end: '#C2410C' }
  }
  return { start: '#FCA5A5', mid: '#EF4444', end: '#B91C1C' }
}

export function StarCelebration({ wrongGuesses, onAnimationComplete }: StarCelebrationProps) {
  const [phase, setPhase] = useState<'enter' | 'pulse' | 'exit'>('enter')
  const color = getStarColor(wrongGuesses)
  const gradient = getStarGradient(wrongGuesses)
  const isGold = wrongGuesses === 0

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setPhase('pulse')
    }, 400)

    const pulseTimer = setTimeout(() => {
      setPhase('exit')
    }, 1200)

    const exitTimer = setTimeout(() => {
      onAnimationComplete()
    }, 1800)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(pulseTimer)
      clearTimeout(exitTimer)
    }
  }, [onAnimationComplete])

  const getAnimationClass = () => {
    switch (phase) {
    case 'enter':
      return 'animate-star-enter'
    case 'pulse':
      return 'animate-star-pulse'
    case 'exit':
      return 'animate-star-exit'
    }
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 1003 }}
    >
      <div className={`${getAnimationClass()}`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="200" 
          height="200" 
          viewBox="0 0 24 24" 
          className="drop-shadow-2xl"
          style={{
            filter: isGold 
              ? 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.8))' 
              : `drop-shadow(0 0 20px ${color}80)`
          }}
        >
          <defs>
            <linearGradient id="starCelebrationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: gradient.start }} />
              <stop offset="50%" style={{ stopColor: gradient.mid }} />
              <stop offset="100%" style={{ stopColor: gradient.end }} />
            </linearGradient>
          </defs>
          <polygon 
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill="url(#starCelebrationGradient)"
            stroke="#000"
            strokeWidth="0.5"
          />
        </svg>
      </div>
      
      <style>{`
        @keyframes star-enter {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes star-pulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.1) rotate(5deg);
          }
          50% {
            transform: scale(1) rotate(0deg);
          }
          75% {
            transform: scale(1.1) rotate(-5deg);
          }
        }
        
        @keyframes star-exit {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotate(180deg);
            opacity: 0;
          }
        }
        
        .animate-star-enter {
          animation: star-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-star-pulse {
          animation: star-pulse 0.8s ease-in-out;
        }
        
        .animate-star-exit {
          animation: star-exit 0.6s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
        }
      `}</style>
    </div>
  )
}
