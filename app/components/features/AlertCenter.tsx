// Componente para realizar o centro de alertas sobre o nível de água e o risco de alagamento da região monitorada
// Component for doing the alert center about the water level and the risk of flooding in the monitored zone
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

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
        console.log("Dados brutos do Supabase:", rawData);

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
        console.error("Erro capturado:", errorMessage);
        setErro(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    buscarDados();
  }, [mounted, supabaseUrl, supabaseKey]);

  if (!mounted) return null;

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '40px auto', padding: '20px', color: '#fff', background: '#18181b', borderRadius: '12px', boxSizing: 'border-box' }}>
      <h2 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Central de Alertas - Nível da Água (Supabase)</h2>
      
      {/* PAINEL DE DIAGNÓSTICO VISUAL */}
      <div style={{ background: '#27272a', padding: '10px 15px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', color: '#a1a1aa' }}>
        🔍 <strong>Diagnóstico:</strong> 
        Loading: <span style={{ color: loading ? '#facc15' : '#4ade80' }}>{String(loading)}</span> | 
        Erro: <span style={{ color: erro ? '#f87171' : '#4ade80' }}>{erro || 'Nenhum'}</span> | 
        Registos encontrados: <strong style={{ color: '#38bdf8' }}>{dados.length}</strong>
      </div>

      {loading && <p style={{ color: '#aaa' }}>A carregar dados do Supabase...</p>}
      
      {erro && (
        <div style={{ padding: '15px', background: '#3a1111', border: '1px solid #ff5555', borderRadius: '5px', color: '#ff8888', margin: '15px 0' }}>
          <strong>⚠️ Erro de Ligação:</strong> {erro}
        </div>
      )}

      {!loading && !erro && dados.length === 0 && (
        <div style={{ padding: '20px', background: '#2d1b0d', border: '1px solid #f59e0b', borderRadius: '6px', color: '#fcd34d' }}>
          <p><strong>Aviso:</strong> A ligação ao Supabase foi bem-sucedida, mas a tabela <strong>leituras</strong> retornou 0 registos.</p>
          <p style={{ fontSize: '13px', marginTop: '5px' }}>Verifique se existem linhas na tabela ou se as políticas RLS estão a bloquear a leitura.</p>
        </div>
      )}

      {!loading && !erro && dados.length > 0 && (
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={dados} 
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="timestampFormatted" 
                stroke="#aaa" 
                tick={{ fontSize: 12 }} 
                dy={10}
              /> 
              <YAxis 
                unit=" cm" 
                stroke="#aaa" 
                tick={{ fontSize: 12 }} 
                width={75} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#444', color: '#fff', borderRadius: '6px' }}
                formatter={(value) => [`${value} cm`, 'Nível da Água']}
              />
              <Line 
                type="monotone" 
                dataKey="nivel_agua_cm" 
                stroke="#00ffcc" 
                strokeWidth={2.5} 
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}