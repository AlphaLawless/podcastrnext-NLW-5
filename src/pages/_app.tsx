//Toda a parte central do nossa Application Next é feita aqui
/* Toda a parte de componentes que não vão mudar na nossa SPA, vai ser importada
   para cá, assim, componentes que não mudam de estado, propriedade ao click ou busca
   do usuário, vai ser estática */

import '../styles/global.scss'

import Header from '../components/Header'
import Player from '../components/Player'

import styles from '../styles/app.module.scss'


function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
  )
}

export default MyApp
