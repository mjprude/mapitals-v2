import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { MAX_WRONG_GUESSES } from '@/constants/game'
import { GripHorizontal, ExternalLink } from 'lucide-react'

interface GameOverModalProps {
  won: boolean
  city: string
  regionName: string
  wrongGuesses: number
  onPlayAgain: () => void
  isUSStatesMode: boolean
}

interface WikipediaBlurb {
  extract: string
  url: string
}

export function GameOverModal({
  won,
  city,
  regionName,
  wrongGuesses,
  onPlayAgain,
  isUSStatesMode,
}: GameOverModalProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [wikipediaBlurb, setWikipediaBlurb] = useState<WikipediaBlurb | null>(null)
  const [isLoadingWikipedia, setIsLoadingWikipedia] = useState(true)
  const modalRef = useRef<HTMLDivElement>(null)

  const fetchWikipediaBlurb = useCallback(async () => {
    setIsLoadingWikipedia(true)
    setWikipediaBlurb(null)
    
    const searchTerm = isUSStatesMode ? regionName : regionName
    
    try {
      const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`
      const response = await fetch(searchUrl)
      
      if (response.ok) {
        const data = await response.json()
        if (data.extract) {
          const truncatedExtract = data.extract.length > 300 
            ? data.extract.substring(0, 300).trim() + '...'
            : data.extract
          setWikipediaBlurb({
            extract: truncatedExtract,
            url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm)}`
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch Wikipedia blurb:', error)
    } finally {
      setIsLoadingWikipedia(false)
    }
  }, [regionName, isUSStatesMode])

  useEffect(() => {
    fetchWikipediaBlurb()
  }, [fetchWikipediaBlurb])

  useEffect(() => {
    setPosition({ x: 0, y: 0 })
  }, [city, regionName])

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      e.preventDefault()
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y })
    }
  }

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0]
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  return (
    <div className="absolute inset-x-0 top-16 flex justify-center" style={{ zIndex: 1001 }}>
      <div 
        ref={modalRef}
        className="bg-purple-900/80 border border-purple-400/30 text-white max-w-md rounded-xl p-6 backdrop-blur-sm mx-4 select-none"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="drag-handle flex items-center justify-center mb-2 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-300">
          <GripHorizontal size={20} />
        </div>
        <h2 className={`text-2xl font-bold mb-4 ${won ? "text-emerald-400" : "text-red-400"}`}>
          {won ? "Congratulations!" : "Game Over!"}
        </h2>
        <p className="text-xl mb-2">
                  The answer was: <span className="font-bold text-yellow-300">{city}</span>, <span className="font-bold text-cyan-300">{regionName}</span>
        </p>
        {won && (
          <p className="text-lg mb-4">
                    Points earned: <span className="text-yellow-300 font-bold">+{MAX_WRONG_GUESSES - wrongGuesses}</span>
          </p>
        )}
        
        <div className="mt-4 p-3 bg-purple-800/50 rounded-lg border border-purple-400/20">
          <h3 className="text-sm font-semibold text-white/80 mb-2">
                    About {regionName}
          </h3>
          {isLoadingWikipedia ? (
            <p className="text-sm text-white/60 italic">Loading...</p>
          ) : wikipediaBlurb ? (
            <>
              <p className="text-sm text-white/80 leading-relaxed mb-2">
                {wikipediaBlurb.extract}
              </p>
              <a 
                href={wikipediaBlurb.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                        Read more on Wikipedia <ExternalLink size={14} />
              </a>
            </>
          ) : (
            <p className="text-sm text-white/60 italic">Could not load information.</p>
          )}
        </div>

        <Button
          onClick={onPlayAgain}
          className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
        >
                  Play Again
        </Button>
      </div>
    </div>
  )
}
