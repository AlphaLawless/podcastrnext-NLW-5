import { createContext, ReactNode, useState } from 'react'

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

  //Agora vamos precisar de uma function para manipular os valores dessas varibles nos Estados.
  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  //Criando uma function para mudar o estado de play (ou seja, pausar) no nosso player
  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState }}>
      { children}
    </PlayerContext.Provider>
  )
}