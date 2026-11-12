// Componente e página para a explicação da solução e a junção de suas funcionalidades
// Component and page for explaining the solution and the junction of it funcionalites
import React from 'react'
import { Neuton } from "next/font/google";
import AlertCenter from '../components/features/AlertCenter';
import HistoryChart from '../components/features/HistoryChart';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import LevelAlert from '../components/features/LevelAlert';

const neutonFont = Neuton({
    subsets: ["latin"],
    weight: "400",
});


export default function SolutionPage() {
  return (
    <>
      <Header/>
        <main className="bg-[#111418] flex flex-col items-center justify-center">
          <h1 className={`${neutonFont.className} text-white text-5xl font-bold mb-6`}>Central de Monitoramento</h1>
          <LevelAlert />
        </main>
        <AlertCenter/>
        <HistoryChart/>
      <Footer/>
    </>
  );
}
