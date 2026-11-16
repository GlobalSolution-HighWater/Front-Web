// Componente Home da solução e página principal do projeto
// Home component of the solution and principal page of the project
import { Neuton } from "next/font/google";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import React from 'react'
import Link from "next/link";

const neutonFont = Neuton({
  subsets: ["latin"],
  weight: "400",
});

const Home = () => {
  return (
    <>
      <header>
        <Header />
      </header>

      <main className={`${neutonFont.className} overflow-hidden bg-[#111418] text-white`}>
        {/* Quem Somos */}
        <section className="relative overflow-hidden bg-[#087F9B] px-5 py-14 text-center shadow-[0_14px_50px_rgba(0,0,0,0.24)] sm:py-16 lg:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12]">
            <div className="absolute -left-20 -top-32 h-80 w-80 rounded-full border-[1px] border-white" />
            <div className="absolute -right-20 -bottom-44 h-[28rem] w-[28rem] rounded-full border-[1px] border-white" />
          </div>
          <h1 className="relative m-0 text-4xl font-normal tracking-wide text-white sm:text-5xl lg:text-6xl">Quem Somos ?</h1>
          <div aria-hidden="true" className="relative mx-auto mt-5 h-[2px] w-16 rounded-full bg-white/70" />
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
            <article className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-[#087F9B]/40 bg-[#111418] p-6 shadow-[0_16px_44px_rgba(0,0,0,0.2)] sm:p-8 lg:col-span-4">
              <div aria-hidden="true" className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#087F9B]/40" />
              <p className="relative m-0 text-xl leading-relaxed text-white/90 sm:text-2xl">
                Nós somos uma Startup que busca ajudar a vida das pessoas, onde criamos uma solução para enchentes.
              </p>
              <div aria-hidden="true" className="relative mt-8 h-1 w-14 rounded-full bg-[#087F9B]" />
            </article>

            <article className="rounded-3xl border border-[#087F9B]/30 bg-[#111418] p-6 shadow-[0_16px_44px_rgba(0,0,0,0.2)] sm:p-8 lg:col-span-8">
              <p className="m-0 text-lg leading-[1.8] text-white/80 sm:text-xl sm:leading-[1.85]">
                Temos um dispositivo que mede o nível da água nas proximidades do local que ele foi instalado e manda as informações obtidas para este site na seção da <Link href="/Solution" className="font-semibold text-white underline decoration-[#087F9B] decoration-2 underline-offset-4 transition hover:decoration-white">solução</Link>, nessa seção nós temos gráficos, históricos e níveis de alertas, tudo para informar as pessoas que estão nas proximidades para elas se prepararem e terem conhecimento se estão em uma área de risco de enchente. Com isso elas podem procurar um abrigo e se salvarem com maior eficiência e sem serem pegas de surpresa.
              </p>
            </article>

            <article className="flex items-start gap-4 rounded-2xl border border-[#087F9B]/30 bg-[#087F9B]/10 p-5 sm:items-center sm:p-6 lg:col-span-12">
              <span aria-hidden="true" className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#087F9B] ring-4 ring-[#087F9B]/20 sm:mt-0" />
              <p className="m-0 text-lg leading-relaxed text-white/80 sm:text-xl">
                Atualmente o projeto está em fase incial para testes e para analisar a sua viabilidade, caso a análise indique que o projeto é viável expandiremos o número de dispositivos e número de regiões monitoradas.
              </p>
            </article>
          </div>
        </section>

        {/* O Problema */}
        <section className="border-y border-[#087F9B]/50 bg-[#087F9B] px-5 py-12 text-center sm:py-14">
          <h1 className="m-0 text-4xl font-normal tracking-wide text-white sm:text-5xl lg:text-6xl">O Problema</h1>
          <div aria-hidden="true" className="mx-auto mt-5 h-[2px] w-16 rounded-full bg-white/70" />
          <h2 className="mx-auto mb-0 mt-6 max-w-4xl text-xl font-normal leading-relaxed text-white sm:text-2xl lg:text-3xl">
            Vulnerabilidade urbana e necessidade de monitoramento de alagamentos
          </h2>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <article className="rounded-3xl border border-[#087F9B]/35 bg-[#111418] p-6 shadow-[0_16px_44px_rgba(0,0,0,0.2)] sm:p-8 lg:col-span-7">
              <h1 className="mb-5 mt-0 text-4xl font-normal text-white sm:text-5xl">Contexto:</h1>
              <p className="m-0 text-lg leading-[1.8] text-white/80 sm:text-xl sm:leading-[1.85]">
                Os alagamentos e as inundações representam desafios recorrentes para a infraestrutura urbana, afetando a mobilidade, a segurança da população e o funcionamento das cidades. Durante períodos de chuvas intensas, determinados pontos podem apresentar acúmulo ou elevação rápida do nível da água, exigindo atenção às condições locais e à evolução desses fenômenos.
              </p>
            </article>

            <article className="relative flex flex-col justify-center overflow-hidden rounded-3xl border border-[#087F9B]/50 bg-[#087F9B] p-6 shadow-[0_16px_44px_rgba(0,0,0,0.22)] sm:p-8 lg:col-span-5">
              <div aria-hidden="true" className="absolute -bottom-16 -right-12 h-48 w-48 rounded-full border border-white/20" />
              <h2 className="relative mb-5 mt-0 text-xl font-normal leading-snug text-white sm:text-2xl">
                Indicador Municipal - Janeiro a Agosto - 2026
              </h2>
              <p className="relative m-0 text-xl leading-relaxed text-white sm:text-2xl">
                Ocorreram <span className="font-bold tracking-wide">457</span> alagamentos e inundações registradas na capital
              </p>
              <div aria-hidden="true" className="relative mt-7 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
                <div className="h-full w-3/4 rounded-full bg-white/80" />
              </div>
            </article>
          </div>
        </section>

        {/* O Cenário Na Cidade de São Paulo */}
        <section className="border-y border-[#087F9B]/50 bg-[#087F9B] px-5 py-12 text-center sm:py-14">
          <h1 className="m-0 text-3xl font-normal tracking-wide text-white sm:text-5xl lg:text-6xl">O Cenário Na Cidade de São Paulo</h1>
          <div aria-hidden="true" className="mx-auto mt-5 h-[2px] w-16 rounded-full bg-white/70" />
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <p className="mx-auto mb-12 mt-0 max-w-5xl text-lg leading-[1.8] text-white/80 sm:text-xl sm:leading-[1.85]">
            Além do volume de registros, observar sua distribuição territorial ajuda a compreender que determinadas regiões podem concentrar mais ocorrências ao longo do tempo. Esse recorte permite discutir a vulnerabilidade urbana de maneira localizada, sem generalizar a situação de toda a cidade a partir de um único ponto.
          </p>

          <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#087F9B]/40 pb-5 sm:flex-row sm:items-end">
            <h2 className="m-0 text-2xl font-normal leading-tight text-white sm:text-3xl">Série Histórica por Subprefeitura - 2013-2025</h2>
            <div aria-hidden="true" className="h-1 w-16 rounded-full bg-[#087F9B]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="group rounded-2xl border border-[#087F9B]/35 bg-[#111418] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#087F9B] hover:shadow-[0_14px_35px_rgba(0,0,0,0.22)] sm:p-6">
              <div aria-hidden="true" className="mb-5 h-1 w-10 rounded-full bg-[#087F9B] transition-all group-hover:w-16" />
              <h3 className="m-0 text-2xl font-normal text-white sm:text-3xl">São Miguel Paulista</h3>
              <p className="mb-0 mt-4 text-lg leading-relaxed text-white/75 sm:text-xl"><span className="font-bold text-white">1.734</span> ocorrências registradas na série histórica.</p>
            </article>
            <article className="group rounded-2xl border border-[#087F9B]/35 bg-[#111418] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#087F9B] hover:shadow-[0_14px_35px_rgba(0,0,0,0.22)] sm:p-6">
              <div aria-hidden="true" className="mb-5 h-1 w-10 rounded-full bg-[#087F9B] transition-all group-hover:w-16" />
              <h3 className="m-0 text-2xl font-normal text-white sm:text-3xl">Sé</h3>
              <p className="mb-0 mt-4 text-lg leading-relaxed text-white/75 sm:text-xl"><span className="font-bold text-white">662</span> ocorrências registradas na série histórica.</p>
            </article>
            <article className="group rounded-2xl border border-[#087F9B]/35 bg-[#111418] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#087F9B] hover:shadow-[0_14px_35px_rgba(0,0,0,0.22)] sm:p-6">
              <div aria-hidden="true" className="mb-5 h-1 w-10 rounded-full bg-[#087F9B] transition-all group-hover:w-16" />
              <h3 className="m-0 text-2xl font-normal text-white sm:text-3xl">Lapa</h3>
              <p className="mb-0 mt-4 text-lg leading-relaxed text-white/75 sm:text-xl"><span className="font-bold text-white">418</span> ocorrências registradas na série histórica.</p>
            </article>
            <article className="group rounded-2xl border border-[#087F9B]/35 bg-[#111418] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#087F9B] hover:shadow-[0_14px_35px_rgba(0,0,0,0.22)] sm:p-6">
              <div aria-hidden="true" className="mb-5 h-1 w-10 rounded-full bg-[#087F9B] transition-all group-hover:w-16" />
              <h3 className="m-0 text-2xl font-normal text-white sm:text-3xl">Pinheiros</h3>
              <p className="mb-0 mt-4 text-lg leading-relaxed text-white/75 sm:text-xl"><span className="font-bold text-white">384</span> ocorrências registradas na série histórica.</p>
            </article>
          </div>

          <article className="mt-8 rounded-3xl border border-[#087F9B]/45 bg-[#087F9B]/10 p-6 sm:p-8">
            <div aria-hidden="true" className="mb-5 h-1 w-14 rounded-full bg-[#087F9B]" />
            <h2 className="mb-4 mt-0 text-2xl font-normal text-white sm:text-3xl">O que esse recorte demonstra?</h2>
            <p className="m-0 text-lg leading-[1.8] text-white/80 sm:text-xl sm:leading-[1.85]">
              A concentração de registros em determinadas subprefeituras reforça a importância de analisar as características de cada território e identificar pontos que possam demandar acompanhamento. Esse levantamento poderá apoiar a seleção de locais para uma futura aplicação piloto, que deverá ser validada com informações específicas de cada região.
            </p>
          </article>
        </section>

        {/* A Necessidade Identificada */}
        <section className="border-y border-[#087F9B]/50 bg-[#087F9B] px-5 py-12 text-center sm:py-14">
          <h1 className="m-0 text-3xl font-normal tracking-wide text-white sm:text-5xl lg:text-6xl">A Necessidade Identificada</h1>
          <div aria-hidden="true" className="mx-auto mt-5 h-[2px] w-16 rounded-full bg-white/70" />
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <article className="rounded-3xl border border-[#087F9B]/35 bg-[#111418] p-6 shadow-[0_16px_44px_rgba(0,0,0,0.2)] sm:p-8">
            <p className="m-0 text-lg leading-[1.8] text-white/80 sm:text-xl sm:leading-[1.85]">
              Em áreas urbanas suscetíveis a alagamentos, compreender apenas que está chovendo ou que existe água acumulada pode não ser suficiente para acompanhar a evolução de uma situação. Também é relevante observar como o nível da água se comporta ao longo do tempo e comunicar essa informação de forma compreensível.
            </p>
          </article>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <article className="rounded-3xl border border-[#087F9B]/45 bg-[#087F9B]/10 p-6 sm:p-8">
              <div aria-hidden="true" className="mb-5 h-1 w-12 rounded-full bg-[#087F9B]" />
              <h2 className="mb-4 mt-0 text-2xl font-normal text-white sm:text-3xl">Problema Central</h2>
              <p className="m-0 text-lg leading-[1.8] text-white/80 sm:text-xl sm:leading-[1.85]">
                Como fornecer informações locais e atualizadas sobre o nível da água e sua tendência de elevação em pontos urbanos suscetíveis a alagamentos na cidade de São Paulo?
              </p>
            </article>

            <article className="rounded-3xl border border-[#087F9B]/45 bg-[#087F9B] p-6 shadow-[0_16px_44px_rgba(0,0,0,0.2)] sm:p-8">
              <div aria-hidden="true" className="mb-5 h-1 w-12 rounded-full bg-white/70" />
              <h2 className="mb-4 mt-0 text-2xl font-normal text-white sm:text-3xl">Necessidade</h2>
              <p className="m-0 text-lg leading-[1.8] text-white sm:text-xl sm:leading-[1.85]">
                Facilitar o acompanhamento das condições de pontos específicos da cidade, transformando medições do nível da água em informações claras e atualizadas que apoiem a percepção de possíveis situações de risc
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default Home;
