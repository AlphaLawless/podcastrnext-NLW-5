import { createContext, ReactNode, useContext, useState } from 'react'

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
  isLooping: boolean
  isShuffling: boolean
  play: (episde: Episode) => void
  setPlayingState: (state: boolean) => void
  playList: (list: Episode[], index: number) => void
  togglePlay: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  playPrevious: () => void
  playNext: () => void
  clearPlayState: () => void
  hasNext: boolean
  hasPrevious: boolean
}

export const PlayerContext = createContext({} as PlayerContextDate)


//Retirado o ContextProvider  do _app para facilitar a manutenção e entendimento da passagem de dados

//criando a tipagem do children

type PlayerContextProviderProps = {
  children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  /* essa parte serve para transformar uma mudança no react. Fazendo com que [duas] variáveis estejam
     inseridas no estado do react. */
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  //Create the new state for isPlaying in audio
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  //Agora vamos precisar de uma function para manipular os valores dessas varibles nos Estados.
  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  //Criando uma function para mudar o estado de play (ou seja, pausar) no nosso player
  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function clearPlayState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  //Criando uma function para usar os botões de próximo ou anterior
  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      isLooping,
      isShuffling,
      togglePlay,
      toggleLoop,
      play,
      setPlayingState,
      playList,
      playNext,
      playPrevious,
      hasNext,
      hasPrevious,
      toggleShuffle,
      clearPlayState
    }}>
      { children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}