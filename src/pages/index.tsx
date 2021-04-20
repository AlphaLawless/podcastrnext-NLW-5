// Consumindo uma HOME API
// SPA - Usamos chamadas com a function do Reactjs useEffect() - Dispara algo, sempre que algo muda na nossa App.
// SSR - Basta usar uma chamada (export async function) getServerSideProps() - Os dados vão ser rodados todos de uma vez no Next
// SSG - Basta usar a mesma chamada do SSR () getStaticProps() - Só funciona os dados em Produção

export default function Home(props) {
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

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
}
