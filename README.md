# HighWater — Front-Web

Aplicação web do projeto **HighWater**, uma proposta de monitoramento local do nível da água em áreas urbanas suscetíveis a alagamentos. O site apresenta o problema, uma central de visualização de leituras e uma simulação educativa do dispositivo ESP32 + sensor ultrassônico.

- **Repositório:** [GlobalSolution-HighWater/Front-Web](https://github.com/GlobalSolution-HighWater/Front-Web/tree/dev)
- **Projeto Wokwi de referência:** [HighWater Copy](https://wokwi.com/projects/480523746575880193)


## Funcionalidades

### Página inicial — `/`

Apresenta a iniciativa HighWater, o contexto de alagamentos na cidade de São Paulo e indicadores por período e subprefeitura. Os números mostrados na página inicial estão escritos diretamente no componente `app/pages/Home.tsx`; não são atualizados por uma API. Para publicação, associe esses indicadores às respectivas fontes oficiais e períodos de referência.

### Central de monitoramento — `/solution`

- Exibe o nível mais recente da água e uma classificação de risco.
- Apresenta gráficos de leituras usando [Recharts](https://recharts.org/).
- Consulta a tabela `leituras` no Supabase por meio da API REST.
- Usa estes limites para o alerta:

| Nível da água | Classificação |
| --- | --- |
| Até 60 cm | Normal |
| Acima de 60 cm até 100 cm | Atenção |
| Acima de 100 cm | Crítico |

As consultas atuais são feitas ao carregar os componentes. O frontend não implementa assinatura Supabase Realtime nem atualização periódica por polling.

### Simulação do dispositivo — `/simulation`

Simulação visual e interativa, inspirada no projeto Wokwi de referência, com ESP32 DevKit C V4 e sensor HC-SR04. Permite ajustar a distância medida, simular uma falha de eco, acompanhar o cálculo do nível, visualizar leituras locais, o monitor serial e uma prévia JSON.

- Referência do sensor: **150 cm**.
- Fórmula: **nível da água = 150 cm − distância medida**.
- Ciclo demonstrativo: **3 segundos**.
- Uma leitura sem eco ou com distância acima de 150 cm é inválida.
- Os tópicos MQTT do firmware de referência são exibidos apenas para contexto; a página não se conecta a MQTT, HTTP, Supabase ou ao iframe do Wokwi.
- As leituras e a prévia ficam somente no estado em memória do navegador; não são enviadas nem persistidas.

A simulação é uma representação educativa da lógica e da montagem, não executa o firmware original em uma MCU virtual. Ela é independente do Supabase e não alimenta a central de monitoramento.

## Tecnologias

- [Next.js](https://nextjs.org/) 16 — App Router
- React 19 e TypeScript 5
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Recharts](https://recharts.org/) 3 para gráficos
- Supabase REST API para leitura dos dados da central
- `next/font` com as fontes Geist e Neuton

## Requisitos

- Node.js **20.9 ou superior**
- npm (o repositório inclui `package-lock.json`)
- Acesso ao Supabase apenas para carregar os dados da rota `/solution`

## Como executar localmente

```bash
git clone --branch dev https://github.com/GlobalSolution-HighWater/Front-Web.git
cd Front-Web
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).





## Estrutura do projeto

```text
app/
├── components/
│   ├── features/
│   │   ├── AlertCenter.tsx
│   │   ├── HistoryChart.tsx
│   │   └── LevelAlert.tsx
│   └── ui/
│       ├── Footer.tsx
│       └── Header.tsx
├── pages/
│   └── Home.tsx
├── simulation/
│   └── page.tsx
├── solution/
│   └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx
public/
├── Icone.ico
└── Logo.png
```

## Privacidade e limites do protótipo

- A rota `/simulation` não envia leituras nem faz chamadas de rede para simular o dispositivo.
- A rota `/solution` faz requisições de leitura do navegador para o Supabase configurado. Isso é diferente da simulação local.
- Carregar o próprio site hospedado ainda exige a requisição normal ao servidor que o serve; o que não é transmitido pela simulação são as leituras e o payload demonstrativo.
- O projeto é informativo e experimental. Não deve ser usado como substituto de alertas oficiais, monitoramento certificado ou orientação de emergência.

## Referências

- [Projeto Wokwi HighWater Copy](https://wokwi.com/projects/480523746575880193)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do Supabase](https://supabase.com/docs)

## Integrantes

- Felipe Rabelo -RM 570340
- Gustavo Ferreira Tavares -RM 569928
- Ricardo Salmerón -RM 572916