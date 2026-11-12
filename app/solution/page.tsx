// Componente e página para a explicação da solução e a junção de suas funcionalidades
// Component and page for explaining the solution and the junction of it funcionalites
import React from 'react'
import AlertCenter from '../components/features/AlertCenter'
import HistoryChart from '../components/features/HistoryChart';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function SolutionPage() {
  return (
    <>
      <Header/>
      <AlertCenter/>
      <HistoryChart/>
      <Footer/>
    </>
  );
}
