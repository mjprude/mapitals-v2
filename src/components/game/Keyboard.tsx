import { forwardRef } from 'react'
import { Button } from '@/components/ui/button'

interface KeyboardProps {
  guessedLetters: Set<string>
  gameOver: boolean
  fullText: string
  isMobile: boolean
  onGuess: (letter: string) => void
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const Keyboard = forwardRef<HTMLDivElement, KeyboardProps>(
  function Keyboard({ guessedLetters, gameOver, fullText, isMobile, onGuess }, ref) {
    return (
      <div 
        ref={ref} 
        tabIndex={-1} 
        className="bg-purple-900/80 backdrop-blur-sm rounded-lg px-2 py-2 outline-none border border-purple-400/20" 
        aria-label="Guess a letter"
      >
        <div className="flex flex-wrap justify-center gap-1">
          {ALPHABET.map(letter => {
            const isGuessed = guessedLetters.has(letter.toLowerCase())
            const isCorrect = fullText.includes(letter.toLowerCase())

            return (
              <Button
                key={letter}
                onClick={() => onGuess(letter)}
                disabled={isGuessed || gameOver}
                variant="outline"
                className={`
                  ${isMobile ? 'h-9 w-9 text-sm' : 'h-7 w-7 sm:h-8 sm:w-8 text-xs sm:text-sm'} p-0 font-bold
                  ${isGuessed
                ? isCorrect
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-red-500 border-red-500 text-white'
                : 'bg-purple-700/80 border-purple-500/50 text-white hover:bg-purple-600'
              }
                `}
              >
                {letter}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }
)
