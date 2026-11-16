# Documentação de Uso de Inteligência Artificial — High Water

> Registro do uso de ferramentas de Inteligência Artificial durante o desenvolvimento do **High Water**, um sistema de monitoramento do nível da água e prevenção de enchentes.

Este documento apresenta as ferramentas utilizadas, os principais problemas trabalhados com o auxílio da IA, as contribuições aplicadas ao projeto e os procedimentos adotados para validar as sugestões.

## Sumário

- [1. Ferramentas utilizadas](#1-ferramentas-utilizadas)
- [2. Contexto e escopo de uso](#2-contexto-e-escopo-de-uso)
- [3. Principais interações](#3-principais-interações)
  - [3.1. Integração com Supabase e gráficos](#31-integração-com-supabase-e-gráficos)
  - [3.2. Next.js e renderização de componentes](#32-nextjs-e-renderização-de-componentes)
  - [3.3. Tipagem TypeScript e requisições HTTP](#33-tipagem-typescript-e-requisições-http)
  - [3.4. Sistema de alertas de nível da água](#34-sistema-de-alertas-de-nível-da-água)
  - [3.5. Ajustes de layout e interface](#35-ajustes-de-layout-e-interface)
  - [3.6. Políticas de segurança do Supabase](#36-políticas-de-segurança-do-supabase)
- [4. Aplicações no projeto](#4-aplicações-no-projeto)
- [5. Validação das respostas](#5-validação-das-respostas)
- [6. Análise crítica](#6-análise-crítica)

---

## 1. Ferramentas utilizadas

| Ferramenta | Utilização |
|---|---|
| **Google Gemini — Gemini 3 Flash** | Assistência à programação, depuração (*debugging*), integração com Supabase, consultas SQL, refatoração de interface e ajustes de layout. |

A ferramenta foi utilizada como apoio durante o desenvolvimento. As sugestões geradas foram analisadas e testadas pelo grupo antes de serem incorporadas ao projeto.

## 2. Contexto e escopo de uso

O auxílio da Inteligência Artificial esteve concentrado principalmente no desenvolvimento e na manutenção de componentes da aplicação, com foco em:

- Consumo de dados da API REST do Supabase.
- Exibição de leituras de sensores em gráficos.
- Implementação de alertas de acordo com o nível da água.
- Resolução de problemas de renderização no Next.js.
- Correção de erros de tipagem no TypeScript.
- Ajustes de interface utilizando Tailwind CSS.
- Análise de políticas de acesso do banco de dados (RLS).

As interações ocorreram de forma iterativa. O grupo forneceu trechos de código, mensagens de erro e capturas de tela para contextualizar os problemas e avaliar as soluções sugeridas.

## 3. Principais interações

### 3.1. Integração com Supabase e gráficos

**Objetivo:** apresentar em um gráfico os dados armazenados na tabela `leituras` do Supabase.

**Exemplo de solicitação enviada:**

> "Adapt this code to show a chart using the data of a Supabase API..."

A solicitação foi acompanhada por um trecho do código e uma captura de tela da tabela `leituras` no painel do Supabase.

**Auxílio fornecido pela IA:**

- Adaptação da requisição `fetch` para consumir a API REST do Supabase.
- Inclusão de ordenação cronológica por meio do parâmetro `?order=timestamp.asc`.
- Formatação do campo `timestamp` (`timestamptz`) para exibição de horas no padrão `HH:mm:ss`.
- Ajustes no componente de gráfico de linha da biblioteca Recharts.

### 3.2. Next.js e renderização de componentes

**Problema:** o gráfico não era exibido corretamente, mesmo após tentativas de ajuste. Em algumas situações, a página ficava em branco e não apresentava mensagens úteis no console.

**Exemplos de solicitações enviadas:**

- "não está funcionando"
- "não aparece o gráfico"
- "não existe nada no console"

As solicitações foram acompanhadas por capturas de tela do editor e da interface.

**Auxílio fornecido pela IA:**

- Identificação de erros de sintaxe, incluindo parênteses extras em operações com `.map()`.
- Orientação para adicionar a diretiva `'use client'` em componentes que utilizam hooks do React, como `useState` e `useEffect`, no contexto do Next.js App Router.
- Implementação de um estado `mounted` e de dados simulados (*mock data*) para verificar a renderização do gráfico no navegador antes de conectar novamente a API.

### 3.3. Tipagem TypeScript e requisições HTTP

**Problemas:** erros de tipagem no VS Code, incluindo `ts(2345)` e a mensagem *"No overload matches this call"* ao configurar os cabeçalhos de uma requisição `fetch`.

**Exemplo de solicitação enviada:**

> "VS Code says that no overload matches this call in the headers problem."

**Auxílio fornecido pela IA:**

- Orientação para declarar explicitamente os tipos dos cabeçalhos HTTP.
- Utilização de `Record<string, string>` para indicar que as chaves e os valores do objeto `headers` são strings.
- Sugestão de verificar os tipos dos estados e tratar corretamente erros cujo tipo é `unknown` no bloco `catch`.
- Ajustes nos estados do componente, incluindo exemplos como `useState<any[]>([])` e `useState<string | null>(null)`.

A IA também orientou a inclusão dos cabeçalhos `apikey` e `Authorization` nas requisições à API REST do Supabase.

> **Observação de segurança:** chaves e credenciais não devem ser publicadas no código ou neste documento. A chave `sb_publishable` é destinada ao uso público no cliente, mas o acesso aos dados ainda deve ser protegido por políticas adequadas no Supabase. Chaves secretas ou de serviço nunca devem ser expostas no navegador.

### 3.4. Sistema de alertas de nível da água

**Objetivo:** criar um componente independente chamado `LevelAlert`, responsável por apresentar a situação do nível da água com base em limites definidos pelo projeto.

**Exemplos de solicitações enviadas:**

- "seria outro componente chamado LevelAlert que serve apenas para isso"
- "quero criar um sistema de alerta que mostre a situação do nível da água com base em Acima de 100cm é crítico, acima de 60cm é atenção, abaixo disso é normal"

**Auxílio fornecido pela IA:**

- Desenvolvimento da estrutura modular do componente `LevelAlert.tsx`.
- Orientação para buscar a leitura mais recente do sensor por meio da API REST, utilizando parâmetros como `?order=timestamp.desc&limit=1`.
- Implementação das regras de classificação do nível da água.
- Aplicação de cores dinâmicas com Tailwind CSS para diferenciar os estados de risco.

As regras definidas para o componente foram:

| Nível da água | Situação |
|---|---|
| Acima de 100 cm | **Crítico** |
| Acima de 60 cm até 100 cm | **Atenção** |
| Até 60 cm | **Normal** |

### 3.5. Ajustes de layout e interface

**Problema:** elementos da interface não apareciam corretamente ou ficavam sobrepostos, especialmente o rodapé (`Footer.tsx`).

**Contexto fornecido:** o código do rodapé utilizava as classes `fixed bottom-0`, e o grupo relatou problemas de posicionamento dos componentes na página.

**Auxílio fornecido pela IA:**

- Identificação de que o posicionamento `fixed` fazia o rodapé sair do fluxo natural da página e podia provocar sobreposição.
- Orientação para remover o posicionamento fixo.
- Sugestão de utilizar `mt-auto` e uma estrutura Flexbox em coluna no layout principal.
- Ajustes de estilos para manter o rodapé no final da página sem cobrir o conteúdo.

Também foi solicitada a conversão de estilos inline para classes utilitárias do Tailwind CSS, utilizando a paleta visual do projeto:

| Cor | Código hexadecimal |
|---|---|
| Grafite profundo | `#111418` |
| Ciano vibrante | `#00D5E8` |
| Amarelo sinalização | `#FFD000` |
| Azul petróleo | `#087F9B` |
| Branco | `#FFFFFF` |

### 3.6. Políticas de segurança do Supabase

**Problema:** o painel de diagnóstico indicava que nenhum registro estava sendo encontrado. Foram fornecidas capturas de tela das políticas (*Policies*) e do painel de diagnóstico do Supabase.

**Exemplo de solicitação enviada:**

> "Caso tenha que mudar algo no Supabase me fale o que e onde."

**Auxílio fornecido pela IA:**

- Análise das políticas de Row Level Security (RLS) da tabela `leituras`.
- Identificação de que as políticas existentes permitiam leitura (`SELECT`), mas poderiam bloquear inserções (`INSERT`) não autenticadas.
- Orientação sobre a criação e configuração de políticas SQL para as operações necessárias.

As sugestões envolveram políticas de acesso para leitura e inserção de registros. A configuração final deve sempre refletir as necessidades reais do projeto e seguir o princípio do menor privilégio, evitando liberar operações públicas sem necessidade.

## 4. Aplicações no projeto

Com o auxílio da IA, foram desenvolvidos, modificados ou configurados os seguintes elementos:

### 4.1. Componente `AlertCenter`

Arquivos mencionados: `AlertCenter.tsx` / `AlertCenter.jsx`.

- Consumo da API REST do Supabase por meio do endpoint `/rest/v1/leituras`.
- Configuração de autenticação da requisição por cabeçalhos HTTP.
- Tratamento e formatação de dados temporais com `toLocaleTimeString`.
- Exibição da evolução do campo `nivel_agua_cm` em um gráfico de linha.
- Utilização de componentes do Recharts, como `LineChart`, `XAxis`, `YAxis`, `Tooltip` e `CartesianGrid`.
- Tratamento de erros e estados de carregamento, como `loading`, `erro` e `mounted`.
- Ajustes visuais com Tailwind CSS.

### 4.2. Componente `LevelAlert`

Arquivo mencionado: `LevelAlert.tsx`.

- Busca independente da leitura mais recente do sensor no Supabase.
- Leitura do campo `nivel_agua_cm`.
- Classificação do nível da água em **Normal**, **Atenção** ou **Crítico**, conforme os limites definidos.
- Aplicação de estilos responsivos e cores de status utilizando Tailwind CSS.

### 4.3. Componente `Footer`

Arquivo mencionado: `Footer.tsx`.

- Refatoração do posicionamento do rodapé.
- Remoção de posicionamento fixo que causava sobreposição.
- Utilização de `mt-auto` e Flexbox para manter o rodapé no fluxo natural da página.

### 4.4. Configuração do Supabase

- Análise das políticas de Row Level Security (RLS).
- Orientações para configurar permissões de leitura (`SELECT`) e inserção (`INSERT`) na tabela `leituras`.
- Verificação da relação entre as permissões configuradas e as operações realizadas pela aplicação.

## 5. Validação das respostas

O grupo não aplicou as respostas geradas pela IA de forma automática. As sugestões foram verificadas por meio de testes e ajustes sucessivos.

1. **Testes isolados com dados simulados:** quando o gráfico não era renderizado, foram utilizados dados fictícios (*mock data*) para verificar se o problema estava na biblioteca Recharts ou na integração com a API.
2. **Inspeção no navegador e no terminal:** foram verificados o console do navegador (`F12`), os avisos do compilador TypeScript e os registros de diagnóstico da aplicação.
3. **Validação no painel do Supabase:** foram consultados o *Table Editor* e a área de políticas de acesso para verificar a estrutura dos registros e o comportamento das permissões.
4. **Testes visuais:** foram avaliados o posicionamento dos componentes, a responsividade e o contraste das cores na interface.
5. **Ajustes iterativos:** quando uma sugestão não resolvia completamente o problema, novas informações, códigos e capturas de tela eram fornecidos à ferramenta para refinar o diagnóstico.

## 6. Análise crítica

### Benefícios

- Acelerou a investigação e a resolução de problemas de integração entre Next.js, React, TypeScript, Recharts e Supabase.
- Ajudou a identificar problemas de renderização, sintaxe e tipagem.
- Facilitou a modularização de funcionalidades, separando a exibição dos gráficos da lógica de alertas.
- Ajudou a compreender configurações de acesso do Supabase e a relação entre as políticas RLS e as operações da aplicação.
- Auxiliou na padronização visual da interface com Tailwind CSS.
- A interpretação de capturas de tela permitiu contextualizar erros do editor, configurações do banco de dados e referências visuais do projeto.

### Limitações e dificuldades

- A IA não tinha acesso direto ao ambiente local de desenvolvimento nem às configurações do painel do Supabase em tempo real.
- Algumas soluções exigiram várias interações até que o problema fosse identificado corretamente.
- Os erros não dependiam apenas do código: também estavam relacionados à configuração do Next.js, à tipagem estrita do TypeScript e às políticas de segurança do banco de dados.
- Sugestões de código precisaram ser revisadas para respeitar a estrutura de pastas, as variáveis de ambiente e as necessidades específicas do projeto.
- A análise de layout dependia das capturas de tela e dos trechos de código fornecidos, não de uma inspeção direta da página em execução.

### Considerações finais

A Inteligência Artificial foi utilizada como ferramenta de apoio ao desenvolvimento do High Water, contribuindo para a investigação de erros, a implementação de componentes e a melhoria da interface. Entretanto, as respostas não substituíram a análise técnica do grupo: as sugestões precisaram ser avaliadas, adaptadas e testadas no próprio projeto antes de serem consideradas adequadas.
