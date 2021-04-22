import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { GetStaticPaths, GetStaticProps } from 'next'

import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/ConvertDurationToTimeString'


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
    <h1>{episode.title}</h1>
  )
}
//Slug serve para deixar o nome bonita na URL, atrativa ao olhos de quem ver.
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
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