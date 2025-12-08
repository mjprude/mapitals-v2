import { Button } from '@/components/ui/button'
import { Timer, Trophy, Target, RotateCcw, X } from 'lucide-react'

interface TimedModeEndModalProps {
  capitalsGuessed: number
  sessionScore: number
  bestCapitals: number
  bestScore: number
  onPlayAgain: () => void
  onExit: () => void
}

export function TimedModeEndModal({
  capitalsGuessed,
  sessionScore,
  bestCapitals,
  bestScore,
  onPlayAgain,
  onExit,
}: TimedModeEndModalProps) {
  const isNewBestCapitals = capitalsGuessed > 0 && capitalsGuessed >= bestCapitals
  const isNewBestScore = sessionScore > 0 && sessionScore >= bestScore

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm" style={{ zIndex: 1000 }}>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-slate-600">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-rose-500/20 p-4 rounded-full">
              <Timer size={48} className="text-rose-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Time's Up!</h2>
          <p className="text-slate-300 mb-6">Great effort! Here's how you did:</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target size={20} className="text-emerald-400" />
                <span className="text-slate-300 text-sm">Capitals</span>
              </div>
              <p className="text-3xl font-bold text-emerald-400">{capitalsGuessed}</p>
              {isNewBestCapitals && (
                <p className="text-xs text-amber-400 mt-1">New Best!</p>
              )}
              {!isNewBestCapitals && bestCapitals > 0 && (
                <p className="text-xs text-slate-400 mt-1">Best: {bestCapitals}</p>
              )}
            </div>
            
            <div className="bg-slate-700/50 p-4 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy size={20} className="text-amber-400" />
                <span className="text-slate-300 text-sm">Score</span>
              </div>
              <p className="text-3xl font-bold text-amber-400">{sessionScore}</p>
              {isNewBestScore && (
                <p className="text-xs text-amber-400 mt-1">New Best!</p>
              )}
              {!isNewBestScore && bestScore > 0 && (
                <p className="text-xs text-slate-400 mt-1">Best: {bestScore}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onExit}
              variant="outline"
              className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <X size={18} className="mr-2" />
              Exit
            </Button>
            <Button
              onClick={onPlayAgain}
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
            >
              <RotateCcw size={18} className="mr-2" />
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
