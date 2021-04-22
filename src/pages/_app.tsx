//Toda a parte central do nossa Application Next é feita aqui
/* Toda a parte de componentes que não vão mudar na nossa SPA, vai ser importada
   para cá, assim, componentes que não mudam de estado, propriedade ao click ou busca
   do usuário, vai ser estática */

import '../styles/global.scss'

import Header from '../components/Header'
import Player from '../components/Player'
import { PlayerContext } from '../contexts/PlayerContext'

import styles from '../styles/app.module.scss'
import { useState } from 'react'


function MyApp({ Component, pageProps }) {
  /* essa parte serve para transformar uma mudança no react. Fazendo com que [duas] variáveis estejam
     inseridas no estado do react. */
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  //Create the new state for isPlaying in audio
  const [isPlaying, setIsPlaying] = useState(false)

  //Agora vamos precisar de uma function para manipular os valores dessas varibles nos Estados.
  function play(episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  //Criando uma function para mudar o estado de play (ou seja, pausar) no nosso player
  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
