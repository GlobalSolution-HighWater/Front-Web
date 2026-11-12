// Componente para indicar o perigo do nível atual da água na região monitorada
// Component for indicate the atual danger level of the water in the monitored region

'use client';

import { useState, useEffect } from 'react';

export default function LevelAlert() {
  const [nivelAtual, setNivelAtual] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

  useEffect(() => {
    async function buscarUltimaLeitura() {
      try {
        if (!supabaseUrl || !supabaseKey) {
          throw new Error("Variáveis de ambiente em falta!");
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/leituras?order=timestamp.desc&limit=1`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const rawData = await response.json();

        if (Array.isArray(rawData) && rawData.length > 0) {
          setNivelAtual(rawData[0].nivel_agua_cm);
        } else {
          setNivelAtual(0);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setErro(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    buscarUltimaLeitura();
  }, [supabaseUrl, supabaseKey]);

  const getStatusInfo = (n: number) => {
    if (n > 100) {
      return { texto: 'CRÍTICO', badge: 'bg-red-600 text-white', icon: '🚨', border: 'border-red-500' };
    }
    if (n > 60) {
      return { texto: 'ATENÇÃO', badge: 'bg-[#FFD000] text-[#111418]', icon: '⚠️', border: 'border-[#FFD000]' };
    }
    return { texto: 'NORMAL', badge: 'bg-[#00D5E8] text-[#111418]', icon: '✅', border: 'border-[#00D5E8]' };
  };

  const status = getStatusInfo(nivelAtual ?? 0);

  return (
    <div className={`w-full max-w-sm bg-[#111418] border-2 ${status.border} rounded-xl p-5 text-white shadow-2xl flex items-center justify-between my-4 mx-auto`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{status.icon}</span>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Nível da Água</p>
          <span className={`inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${status.badge}`}>
            {status.texto}
          </span>
        </div>
      </div>

      <div className="text-right">
        {loading ? (
          <span className="text-xs text-yellow-400">A carregar...</span>
        ) : erro ? (
          <span className="text-xs text-red-400">Erro</span>
        ) : (
          <div>
            <span className="text-2xl font-extrabold text-[#00D5E8]">{nivelAtual}</span>
            <span className="text-xs text-gray-400 ml-1">cm</span>
          </div>
        )}
      </div>
    </div>
  );
}