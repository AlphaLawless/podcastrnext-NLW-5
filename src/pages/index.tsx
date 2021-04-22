// Consumindo uma HOME API
// SPA - Usamos chamadas com a function do Reactjs useEffect() - Dispara algo, sempre que algo muda na nossa App.
// SSR - Basta usar uma chamada (export async function) getServerSideProps() - Os dados vão ser rodados todos de uma vez no Next
// SSG - Basta usar a mesma chamada do SSR () getStaticProps() - Só funciona os dados em Produção

import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/ConvertDurationToTimeString'

import styles from './home.module.scss'


//Parte para adiciona tipagem ao nosso Props(Propriedade)
type Episode = {
  id: string
  title: string
  members: string
  published_at: string
  publishedAt: string
  thumbnail: string
  url: string
  durationAsString: string
  duration: number
}

type HomeProps = {
  //há outro forma de trabalhar isso Array<Episode>
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}
//Parte para adiciona tipagem ao nosso Props(Propriedade)

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodesDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos Episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integração</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

//Feito tudo essa parte de API Static do Projeto, precisamos executar uma build do Projeto
//yarn build (compilar) + yarn start - como se estivesse em Produção, para gerar as páginas de forma Estática

export const getStaticProps: GetStaticProps = async () => {
  //Outra forma de chamar o data -> const data = await response.data
  const { data } = await api.get('episodes', {
    //Passando os parametros em formato estruturado pelo JavaScript.
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  //Criando uma forma de nossa redenrizações diminuam toda vez que uma pessoa atualizar uma nova página
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
