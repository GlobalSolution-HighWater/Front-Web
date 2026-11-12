// Componente para que monta um gráfico para mostrar o histórico de um período sobre a região analisada
// Component that crate a chart that shows the history in a period about a analyzed region
'use client';
import { Neuton } from "next/font/google";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const neutonFont = Neuton({
    subsets: ["latin"],
    weight: "400",
});


export default function AlertCenter() {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

  useEffect(() => {
    if (!mounted) return;

    async function buscarDados() {
      setLoading(true);
      setErro(null);
      try {
        if (!supabaseUrl || !supabaseKey) {
          throw new Error("Variáveis de ambiente do Supabase em falta no .env.local!");
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/leituras?order=timestamp.asc`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }

        const rawData = await response.json();

        if (Array.isArray(rawData)) {
          const dadosFormatados = rawData.map(item => ({
            ...item,
            timestampFormatted: item.timestamp 
              ? new Date(item.timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : ''
          }));
          setDados(dadosFormatados);
        } else {
          setDados([]);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setErro(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    buscarDados();
  }, [mounted, supabaseUrl, supabaseKey]);

  if (!mounted) return null;

    return (
    <>
    <div className='min-h-screen bg-[#111418]'>
      <div className={`${neutonFont.className} text-2xl px-10 py-5 m-3 `}>
        <h2>A seguir temos um gráfico com os dados obtidos em todo o período ativo do nosso dispositivo que atualiza automáticamente e mostra o nível atual da água no local monitorado.</h2>
        </div>
      <div className="w-full mx-auto my-10 p-6 bg-[#111418] text-white rounded-xl shadow-2xl border border-[#087F9B]/30 box-border">
        <h2 className="mb-4 text-2xl font-bold tracking-wide text-white">
          Histórico do nível da Água
        </h2>

        {loading && <p className="text-gray-400">Carregando dados... Aguarde Por Favor.</p>}
        
        {erro && (
          <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-lg text-red-200 my-4">
            <strong>⚠️ Erro de Ligação:</strong> {erro}
          </div>
        )}

        {!loading && !erro && dados.length === 0 && (
          <div className="p-5 bg-[#FFD000]/10 border border-[#FFD000]/40 rounded-lg text-[#FFD000]">
            <p className="font-semibold">Aviso: A ligação ao Supabase foi bem-sucedida, mas a tabela <strong>leituras</strong> retornou 0 registos.</p>
            <p className="text-xs mt-1 text-gray-300">Insira dados na tabela ou verifique as políticas de inserção no Supabase.</p>
          </div>
        )}

        {!loading && !erro && dados.length > 0 && (
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart 
                data={dados} 
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#087F9B" opacity={0.3} />
                <XAxis 
                  dataKey="timestampFormatted" 
                  stroke="#FFFFFF" 
                  opacity={0.8}
                  tick={{ fontSize: 12 }} 
                  dy={10}
                /> 
                <YAxis 
                  unit=" cm" 
                  stroke="#FFFFFF" 
                  opacity={0.8}
                  tick={{ fontSize: 12 }} 
                  width={75} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111418', 
                    borderColor: '#087F9B', 
                    color: '#FFFFFF', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                  }}
                  formatter={(value) => [`${value} cm`, 'Nível da Água']}
                />
                <Line 
                  type="monotone" 
                  dataKey="nivel_agua_cm" 
                  stroke="#00D5E8" 
                  strokeWidth={3} 
                  dot={{ fill: '#00D5E8', r: 4 }}
                  activeDot={{ r: 6, fill: '#FFD000' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
    </>
  );
}