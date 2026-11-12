// Componente para realizar o centro de alertas sobre o nível de água e o risco de alagamento da região monitorada
// Component for doing the alert center about the water level and the risk of flooding in the monitored zone
"use client";
import { useState, useEffect } from 'react';
import { data } from 'react-router';

export default function AlertCenter() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

  useEffect(() => {
    async function buscarDados() {
      setLoading(true);
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/leituras`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          } as Record<string, string>
        });
        
        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error(`Erro ao buscar os dados: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    buscarDados();
  }, []);

  if (loading) return <div>Carregando leituras...</div>;

  return (
    <>
    </>
  );
}