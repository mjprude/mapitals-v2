interface GameDisplayProps {
  isUSStatesMode: boolean
  displayCity: string
  displayRegion: string
}

export function GameDisplay({
  isUSStatesMode,
  displayCity,
  displayRegion,
}: GameDisplayProps) {
  return (
    <div className="flex flex-row gap-3 justify-center">
      <div className="bg-gradient-to-br from-[#7751f8]/80 to-[#9333ea]/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg shadow-purple-500/30">
        <p className="text-amber-300 text-sm font-bold mb-1 uppercase tracking-wide">
          {isUSStatesMode ? 'State Capital' : 'Capital City'}
        </p>
        <p className="text-xl sm:text-2xl font-mono tracking-widest text-white drop-shadow-md">
          {displayCity}
        </p>
      </div>
      <div className="bg-gradient-to-br from-[#06b6d4]/80 to-[#0891b2]/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg shadow-cyan-500/30">
        <p className="text-white text-sm font-bold mb-1 uppercase tracking-wide">
          {isUSStatesMode ? 'State' : 'Country'}
        </p>
        <p className="text-xl sm:text-2xl font-mono tracking-widest text-white drop-shadow-md">
          {displayRegion}
        </p>
      </div>
    </div>
  )
}
