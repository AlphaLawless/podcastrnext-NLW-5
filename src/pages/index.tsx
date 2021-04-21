// Consumindo uma HOME API
// SPA - Usamos chamadas com a function do Reactjs useEffect() - Dispara algo, sempre que algo muda na nossa App.
// SSR - Basta usar uma chamada (export async function) getServerSideProps() - Os dados vão ser rodados todos de uma vez no Next
// SSG - Basta usar a mesma chamada do SSR () getStaticProps() - Só funciona os dados em Produção

import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/ConvertDurationToTimeString'


//Parte para adiciona tipagem ao nosso Props(Propriedade)
type Episode = {
  id: string
  title: string
  members: string
  published_at: string
  publishedAt: string
  thumbnail: string
  description: string
  url: string
  durationAsString: string
  duration: number

}

type HomeProps = {
  //há outro forma de trabalhar isso Array<Episode>
  episodes: Episode[]
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1></h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

//Feito tudo essa parte de API Static do Projeto, precisamos executar uma build do Projeto
//yarn build - como se estivesse em Produção, para gerar as páginas de forma Estática
//Mudança de yarn dev para yarn start para executa a nova funcionalidade do projeto, como se estivesse em Produção.

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
      description: episode.description,
      url: episode.file.url,
    }
  })

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
}
