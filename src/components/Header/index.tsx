//Componente Inicial(Header) da nossa Single Page Application (SPA)
/*O import no next é feito em formato de module.{style}, por isso,
  precisamos puxar o styles de onde estamos fazendo. */

//add o yarn add date-fns para pegar a data

import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'


import styles from './style.module.scss'

export default function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  })
  return (
    //Em react o uso de class é chamado de className, pois class é do próprio JS
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />

      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>
    </header>
  )
}