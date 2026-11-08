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
                    <Header/>
                </header>  
            <div className="min-h-screen bg-[#111418]">      
                <div className="py-10 bg-[#087F9B]">
                        <h1 className={`${neutonFont.className} text-5xl text-center`}>Quem Somos ?</h1>
                </div>
                <div className={`${neutonFont.className} text-2xl px-10 py-5 m-3 `}>
                    <p className="py-2">
                        Nós somos uma Startup que busca ajudar a vida das pessoas, onde criamos uma solução para enchentes. 
                    </p>
                    <p className="py-2">
                        Temos um dispositivo que mede o nível da água nas proximidades do local que ele foi instalado e manda as informações obtidas para este site na seção da <Link href="/Solution">solução</Link>, nessa seção nós temos gráficos, históricos e níveis de alertas, tudo para informar as pessoas que estão nas proximidades para elas se prepararem e terem conhecimento se estão em uma área de risco de enchente. Com isso elas podem procurar um abrigo e se salvarem com maior eficiência e sem serem pegas de surpresa. 
                    </p>
                    <p className="py-2">
                        Atualmente o projeto está em fase incial para testes e para analisar a sua viabilidade, caso a análise indique que o projeto é viável expandiremos o número de dispositivos e número de regiões monitoradas.
                    </p>
                </div>
            </div>
            <footer>
                <Footer/>
            </footer>
    </>
  )
}

export default Home
