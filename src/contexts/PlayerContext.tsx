import { createContext } from 'react'

type Episode = {
  title: string
  members: string
  thumbnail: string
  url: string
  duration: number
}

type PlayerContextDate = {
  episodeList: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  play: (episde: Episode) => void
  setPlayingState: (state: boolean) => void
  togglePlay: () => void
}

export const PlayerContext = createContext({} as PlayerContextDate)

