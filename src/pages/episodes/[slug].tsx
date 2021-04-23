import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/ConvertDurationToTimeString'

import styles from './episode.module.scss'




type Episode = {
  id: string
  title: string
  members: string
  published_at: string
  publishedAt: string
  thumbnail: string
  url: string
  durationAsString: string
  description: string
  duration: number
}

type EpisodeProps = {
  episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}
//Slug serve para deixar o nome bonita na URL, atrativa ao olhos de quem ver.
//Rotas que tem cochetes, precisam usar o método GetStaticPaths() para passarem os caminhos de forma dinamica.
export const getStaticPaths: GetStaticPaths = async () => {
  //Passando a request da homme para a pasta de episodios
  const { data } = await api.get('episodes', {
    //Passando os parametros em formato estruturado pelo JavaScript.
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
  //OBS: com essa variavel paths, passando pelo data, os dois últimos episódios vão ser gerados de forma static.
  //O método fallback pode ser definido como: incremental static regeneration
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params

  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}