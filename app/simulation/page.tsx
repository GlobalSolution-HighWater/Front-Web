// Compenente que mostrará uma simulação do dispositivo para os usuários conhecerem melhor a solução
// Component that shows an device simulation to the users learn how the solution works

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../components/ui/Footer';
import Header from '../components/ui/Header';
import { Neuton } from "next/font/google";

const neutonFont = Neuton({
    subsets: ["latin"],
    weight: "400",
});

type LogKind = 'system' | 'serial' | 'warning' | 'blocked';
type ViewTab = 'firmware' | 'diagram';

type ConsoleEntry = {
  id: number;
  seconds: number;
  kind: LogKind;
  message: string;
};

type Reading = {
  id: number;
  seconds: number;
  distance: number;
  level: number;
};

type LocalPayload = {
  ponto_id: string;
  timestamp: string;
  distancia_cm: number;
  nivel_agua_cm: number;
};

const REFERENCE_HEIGHT_CM = 150;
const SAMPLE_INTERVAL_MS = 3000;
const MAX_CONSOLE_ENTRIES = 100;

const LOCAL_FIRMWARE = `// HighWater Copy — lógica didática, em modo local
const int Trig = 25;                 // HC-SR04 TRIG → GPIO25
const int Echo = 26;                 // HC-SR04 ECHO → GPIO26
const float ALTURA_REFERENCIA = 150.0;
const unsigned long INTERVALO_LEITURA = 3000;

void loopLocal() {
  float distancia = lerSensorVirtual(); // ajustada pelo usuário

  if (distancia < 0 || distancia > ALTURA_REFERENCIA) {
    serialLocal.println("Leitura invalida do sensor.");
    return;
  }

  float nivel = ALTURA_REFERENCIA - distancia;
  serialLocal.printf("Distancia: %.1f cm\\n", distancia);
  serialLocal.printf("Nivel da agua: %.1f cm\\n", nivel);

  // Prévia em memória local — não é publicada.
  mostrarJsonLocal({
    "ponto_id": "ponto01",
    "distancia_cm": distancia,
    "nivel_agua_cm": nivel
  });

  // Wi-Fi / NTP / MQTT / HTTP / API: não instanciados.
  // Nenhum dado sai desta página.
}`;

const LOCAL_DIAGRAM = `{
  "parts": [
    { "type": "board-esp32-devkit-c-v4", "id": "esp" },
    { "type": "wokwi-hc-sr04", "id": "ultrasonic1" }
  ],
  "connections": [
    ["esp:5V",       "ultrasonic1:VCC",  "red"],
    ["esp:GND.1",    "ultrasonic1:GND",  "black"],
    ["esp:25",       "ultrasonic1:TRIG", "green"],
    ["esp:26",       "ultrasonic1:ECHO", "yellow"]
  ]
}`;

const CONSOLE_COLORS: Record<LogKind, { row: string; tag: string; label: string }> = {
  serial: { row: 'text-[#b1c3c4]', tag: 'text-[#72949a]', label: 'SERIAL' },
  system: { row: 'text-[#adced0]', tag: 'text-[#66b7ae]', label: 'SISTEMA' },
  warning: { row: 'text-[#e9cb7b]', tag: 'text-[#e5bb50]', label: 'AVISO' },
  blocked: { row: 'text-[#f29a85]', tag: 'text-[#ec806d]', label: 'BLOQUEADO' },
};

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatCm(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function getRisk(level: number | null, noEcho: boolean) {
  if (level === null) {
    return {
      label: noEcho ? 'SEM ECO' : 'LEITURA INVÁLIDA',
      icon: '×',
      badgeClass: 'border-[#65502b] bg-[#302719] text-[#f1bd70]',
      textClass: 'text-[#f1b760]',
      description: noEcho
        ? 'O sensor não recebeu um pulso de retorno.'
        : 'A distância ultrapassou a altura de referência de 150 cm.',
    };
  }
  if (level > 100) {
    return {
      label: 'CRÍTICO',
      icon: '!',
      badgeClass: 'border-[#76373d] bg-[#351d21] text-[#ff9992]',
      textClass: 'text-[#ff8985]',
      description: 'Nível acima de 100 cm. Situação crítica.',
    };
  }
  if (level > 60) {
    return {
      label: 'ATENÇÃO',
      icon: '!',
      badgeClass: 'border-[#655426] bg-[#332b18] text-[#f2ca6c]',
      textClass: 'text-[#f3ca65]',
      description: 'Nível acima de 60 cm. Atenção ao aumento da água.',
    };
  }
  return {
    label: 'NORMAL',
    icon: '✓',
    badgeClass: 'border-[#215d55] bg-[#10312e] text-[#66e1d1]',
    textClass: 'text-[#68e0d1]',
    description: 'Nível dentro da faixa normal.',
  };
}

export default function SimulationPage() {
  const [distance, setDistance] = useState(72);
  const [noEcho, setNoEcho] = useState(false);
  const [running, setRunning] = useState(true);
  const [activeTab, setActiveTab] = useState<ViewTab>('firmware');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sampleCount, setSampleCount] = useState(0);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [payload, setPayload] = useState<LocalPayload | null>(null);
  const [logs, setLogs] = useState<ConsoleEntry[]>([
    {
      id: 1,
      seconds: 0,
      kind: 'system',
      message: 'HighWater iniciado em ambiente de demonstração local.',
    },
    {
      id: 2,
      seconds: 0,
      kind: 'blocked',
      message: 'Isolamento ativo: Wi-Fi, MQTT, HTTP, API e NTP não são usados.',
    },
  ]);

  const logIdRef = useRef(2);
  const elapsedRef = useRef(0);
  const sampleCountRef = useRef(0);
  const sampleRef = useRef<() => void>(() => undefined);
  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  const validDistance = !noEcho && distance >= 0 && distance <= REFERENCE_HEIGHT_CM;
  const currentLevel = validDistance ? REFERENCE_HEIGHT_CM - distance : null;
  const risk = getRisk(currentLevel, noEcho);
  const activeCode = activeTab === 'firmware' ? LOCAL_FIRMWARE : LOCAL_DIAGRAM;
  const fillPercent = currentLevel === null
    ? 0
    : Math.max(0, Math.min(100, (currentLevel / REFERENCE_HEIGHT_CM) * 100));

  const chartPoints = useMemo(() => {
    const visible = readings.slice(-12);
    return visible.map((reading, index) => {
      const x = visible.length === 1 ? 275 : 40 + index * (470 / (visible.length - 1));
      const y = 176 - (reading.level / REFERENCE_HEIGHT_CM) * 132;
      return `${x},${y}`;
    }).join(' ');
  }, [readings]);

  const addLog = useCallback((kind: LogKind, message: string) => {
    const entry: ConsoleEntry = {
      id: ++logIdRef.current,
      seconds: elapsedRef.current,
      kind,
      message,
    };
    setLogs((current) => [...current, entry].slice(-MAX_CONSOLE_ENTRIES));
  }, []);

  const takeReading = useCallback(() => {
    const nextSeconds = elapsedRef.current + SAMPLE_INTERVAL_MS / 1000;
    elapsedRef.current = nextSeconds;
    setElapsedSeconds(nextSeconds);

    const nextSample = sampleCountRef.current + 1;
    sampleCountRef.current = nextSample;
    setSampleCount(nextSample);

    const entries: Array<Omit<ConsoleEntry, 'id'>> = [
      {
        seconds: nextSeconds,
        kind: 'serial',
        message: `Amostra #${String(nextSample).padStart(3, '0')} • pulso TRIG em GPIO25; leitura do ECHO em GPIO26.`,
      },
    ];

    if (noEcho) {
      entries.push(
        {
          seconds: nextSeconds,
          kind: 'warning',
          message: 'HC-SR04: timeout de 30 ms; pulseIn retornaria 0 e a distância seria -1.',
        },
        {
          seconds: nextSeconds,
          kind: 'blocked',
          message: 'Leitura descartada. Nenhum nível ou pacote foi enviado.',
        },
      );
    } else if (distance < 0 || distance > REFERENCE_HEIGHT_CM) {
      entries.push(
        {
          seconds: nextSeconds,
          kind: 'serial',
          message: `Distância medida: ${formatCm(distance)} cm.`,
        },
        {
          seconds: nextSeconds,
          kind: 'warning',
          message: `Leitura inválida: a distância precisa estar entre 0 e ${REFERENCE_HEIGHT_CM} cm.`,
        },
        {
          seconds: nextSeconds,
          kind: 'blocked',
          message: 'O firmware não criaria uma leitura para publicação neste ciclo.',
        },
      );
    } else {
      const level = Number((REFERENCE_HEIGHT_CM - distance).toFixed(2));
      const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
      const nextPayload: LocalPayload = {
        ponto_id: 'ponto01',
        timestamp,
        distancia_cm: Number(distance.toFixed(2)),
        nivel_agua_cm: level,
      };

      setPayload(nextPayload);
      setReadings((current) => [
        ...current,
        { id: nextSample, seconds: nextSeconds, distance, level },
      ].slice(-24));

      entries.push(
        {
          seconds: nextSeconds,
          kind: 'serial',
          message: `Distância: ${formatCm(distance)} cm • nível da água: ${formatCm(level)} cm.`,
        },
        {
          seconds: nextSeconds,
          kind: 'system',
          message: 'Payload JSON montado somente em memória local (prévia educativa).',
        },
        {
          seconds: nextSeconds,
          kind: 'blocked',
          message: 'ENVIO BLOQUEADO: nenhum pacote MQTT, HTTP ou API foi transmitido.',
        },
      );
    }

    const entriesWithIds = entries.map((entry) => ({ ...entry, id: ++logIdRef.current }));
    setLogs((current) => [...current, ...entriesWithIds].slice(-MAX_CONSOLE_ENTRIES));
  }, [distance, noEcho]);

  useEffect(() => {
    sampleRef.current = takeReading;
  }, [takeReading]);

  useEffect(() => {
    const firstSample = window.setTimeout(() => sampleRef.current(), 700);
    return () => window.clearTimeout(firstSample);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => sampleRef.current(), SAMPLE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [logs]);

  const handleRunToggle = () => {
    const nextRunning = !running;
    setRunning(nextRunning);
    addLog('system', nextRunning ? 'Simulação retomada.' : 'Simulação pausada pelo usuário.');
  };

  const handleReset = () => {
    elapsedRef.current = 0;
    sampleCountRef.current = 0;
    logIdRef.current = 2;
    setElapsedSeconds(0);
    setSampleCount(0);
    setDistance(72);
    setNoEcho(false);
    setReadings([]);
    setPayload(null);
    setLogs([
      {
        id: 1,
        seconds: 0,
        kind: 'system',
        message: 'Simulação reiniciada em modo local.',
      },
      {
        id: 2,
        seconds: 0,
        kind: 'blocked',
        message: 'Saída de rede desativada. Nenhum dado será enviado.',
      },
    ]);
    setRunning(true);
  };

  const clearConsole = () => {
    setLogs([]);
    addLog('system', 'Monitor local limpo. A simulação continua sem rede.');
  };

  const lastReading = readings[readings.length - 1];

  return (
    <div className="min-h-screen bg-[#111418] font-sans text-[#e8f0f1] antialiased">
      <header>
        <Header/>
      </header>

      <main className="mx-auto w-full max-w-[1500px] px-3 pb-8 pt-7 sm:px-6 lg:pt-[38px] xl:px-7" id="top">
        <section className="mb-[26px] flex flex-col justify-between gap-5 lg:flex-row lg:items-center lg:gap-8">
          <div>
            <h1 className={`${neutonFont.className} text-5xl m-0 max-w-[740px] text-[30px] font-bold leading-[1.12] tracking-[-.045em] text-[#f2f8f8] sm:text-[36px] lg:text-[40px]`}>Veja como o sensor mede o nível da água.</h1>
            <p className={`${neutonFont.className} mt-3 max-w-[740px] text-[12px] leading-7 text-[#91a2a7] sm:text-[14px]`}>
              Simulação do nosso dispositivo: ajuste a distância do ultrassônico,
              veja como entendemos o nível da água.
            </p>
          </div>
        </section>

        <section className="mb-4 flex flex-col justify-between gap-3 rounded-[14px] border border-[#FFD000] bg-[#0b1418] p-3.5 sm:flex-row sm:items-center sm:gap-4" id="simulador" aria-label="Controles de execução">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${running ? 'animate-pulse bg-[#00d5a4] shadow-[0_0_0_3px_rgba(0,213,164,0.1)]' : 'bg-[#ffc857] shadow-[0_0_0_3px_rgba(255,200,87,0.1)]'}`} />
            <strong className="text-xs text-[#e0e9ea]">{running ? 'Simulação executando' : 'Simulação pausada'}</strong>
            <span className="hidden h-[18px] w-px bg-[#2a3a3e] sm:block" />
            <span className="text-[11px] text-white">Ciclo de leitura: 3 s</span>
          </div>
          <div className="flex w-full shrink-0 gap-2 sm:w-auto">
            <button type="button" className="inline-flex min-h-[38px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#00d5e8] px-3 text-[11px] font-bold text-[#041316] transition hover:bg-[#59e4ee] active:translate-y-px sm:flex-none" onClick={handleRunToggle}>
              <span aria-hidden="true">{running ? 'Ⅱ' : '▶'}</span>{running ? 'Pausar' : 'Executar'}
            </button>
            <button type="button" className="min-h-[38px] rounded-lg px-3 text-[11px] font-bold text-white" onClick={handleReset}>Reiniciar</button>
          </div>
        </section>

        <section className="grid grid-cols-1 items-stretch gap-4  ">
          <div className="min-w-0 overflow-hidden rounded-[15px] border border-[#FFD000] bg-[#0b1418] shadow-[0_10px_32px_rgba(0,0,0,0.12)] ">
            <div className="flex min-h-[73px] items-center justify-between gap-3 px-4 py-3 sm:px-[19px] bg-[#0b1418]">
              <div>
                <p className="mb-1.5 text-[10px] font-extrabold tracking-[.17em] text-white">DISPOTITIVO</p>
              </div>
            </div>
            <div className="mx-2 overflow-x-auto rounded-xl bg-[#0b1418] p-1.5 sm:mx-3.5 sm:p-2">
              <svg className="block h-auto w-full min-w-[520px] rounded-lg xl:min-w-0" viewBox="0 0 760 390" role="img" aria-label="ESP32 conectado ao sensor ultrassônico HC-SR04">
                <defs>
                  <pattern id="circuitGrid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#183039" strokeWidth="0.7" /></pattern>
                  <linearGradient id="boardShade" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#17483f" /><stop offset="1" stopColor="#10332f" /></linearGradient>
                  <linearGradient id="sensorShade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#26353a" /><stop offset="1" stopColor="#172329" /></linearGradient>
                  <filter id="sensorGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <rect width="760" height="390" rx="14" fill="#0b1217" />
                <rect width="760" height="390" rx="14" fill="url(#circuitGrid)" opacity="0.78" />

                <path d="M191 267V325H433V104H474" fill="none" stroke="#f05d5e" strokeWidth="3" strokeLinejoin="round" />
                <path d="M235 267V342H450V144H474" fill="none" stroke="#35d39a" strokeWidth="3" strokeLinejoin="round" />
                <path d="M279 267V358H462V184H474" fill="none" stroke="#f5c84c" strokeWidth="3" strokeLinejoin="round" />
                <path d="M323 267V372H470V224H474" fill="none" stroke="#92a1a6" strokeWidth="3" strokeLinejoin="round" />

                <g>
                  <rect x="70" y="92" width="270" height="178" rx="12" fill="url(#sensorShade)" stroke="#547078" strokeWidth="2" />
                  <rect x="79" y="101" width="252" height="160" rx="8" fill="none" stroke="#354b52" strokeWidth="1" />
                  <text x="205" y="120" fill="#b7c9cc" fontSize="13" fontWeight="700" textAnchor="middle" letterSpacing="2">ULTRASONIC DISTANCE</text>
                  <circle cx="151" cy="178" r="43" fill="#10191e" stroke="#82a0a6" strokeWidth="4" />
                  <circle cx="151" cy="178" r="31" fill="#17272c" stroke="#3c5a61" strokeWidth="3" />
                  <circle cx="151" cy="178" r="20" fill="#0b1115" stroke="#8eaeb3" strokeWidth="2" />
                  <circle cx="260" cy="178" r="43" fill="#10191e" stroke="#82a0a6" strokeWidth="4" />
                  <circle cx="260" cy="178" r="31" fill="#17272c" stroke="#3c5a61" strokeWidth="3" />
                  <circle cx="260" cy="178" r="20" fill="#0b1115" stroke="#8eaeb3" strokeWidth="2" />
                  {running && !noEcho && <g className="animate-pulse" fill="none" stroke="#00d5e8" strokeWidth="2" opacity="0.75" filter="url(#sensorGlow)"><path d="M119 143Q92 178 119 213" /><path d="M292 143Q319 178 292 213" /></g>}
                  <text x="205" y="242" fill="#6e858b" fontSize="10" textAnchor="middle" letterSpacing="1.3">HC-SR04 · 40 kHz</text>
                  <circle cx="191" cy="267" r="4" fill="#f05d5e" /><circle cx="235" cy="267" r="4" fill="#35d39a" /><circle cx="279" cy="267" r="4" fill="#f5c84c" /><circle cx="323" cy="267" r="4" fill="#92a1a6" />
                  <text x="191" y="288" fill="#f5a5a3" fontSize="9" textAnchor="middle">VCC</text><text x="235" y="288" fill="#91e9c3" fontSize="9" textAnchor="middle">TRIG</text><text x="279" y="288" fill="#f6dd91" fontSize="9" textAnchor="middle">ECHO</text><text x="323" y="288" fill="#c0cbce" fontSize="9" textAnchor="middle">GND</text>
                </g>

                <g>
                  <rect x="474" y="69" width="230" height="265" rx="13" fill="url(#boardShade)" stroke="#56a58e" strokeWidth="2" />
                  <rect x="487" y="82" width="204" height="239" rx="9" fill="none" stroke="#2c6a5a" strokeWidth="1" />
                  <rect x="535" y="132" width="105" height="104" rx="7" fill="#101a1d" stroke="#65a994" strokeWidth="2" />
                  <rect x="549" y="147" width="77" height="73" rx="4" fill="#16282a" stroke="#2c524a" />
                  <text x="587" y="176" fill="#c9eee0" fontSize="12" textAnchor="middle" fontWeight="700">ESP32</text>
                  <text x="587" y="194" fill="#7eb7a3" fontSize="9" textAnchor="middle">DEVKIT C V4</text>
                  <path d="M553 132v-12m12 12v-12m12 12v-12m12 12v-12m12 12v-12m12 12v-12m12 12v-12M553 236v12m12-12v12m12-12v12m12-12v12m12-12v12m12-12v12m12-12v12" stroke="#84c7ae" strokeWidth="2" />
                  <rect x="560" y="95" width="55" height="22" rx="4" fill="#0c1719" stroke="#5e9581" />
                  <text x="587" y="110" fill="#a8cbbd" fontSize="8" textAnchor="middle">USB-C</text>
                  <circle cx="667" cy="106" r="4" className={running ? 'animate-pulse' : ''} fill={running ? '#00d5e8' : '#536a69'} />
                  <text x="667" y="124" fill="#8eb2a4" fontSize="8" textAnchor="middle">PWR</text>
                  <text x="486" y="100" fill="#f7a8a5" fontSize="9" textAnchor="start">5V</text>
                  <text x="486" y="140" fill="#a9f2d0" fontSize="9" textAnchor="start">GPIO25</text>
                  <text x="486" y="180" fill="#ffe6a1" fontSize="9" textAnchor="start">GPIO26</text>
                  <text x="486" y="220" fill="#c2d0d2" fontSize="9" textAnchor="start">GND</text>
                  <text x="589" y="274" fill="#75a997" fontSize="10" textAnchor="middle" letterSpacing="1.4">HIGHWATER NODE</text>
                  <text x="589" y="292" fill="#547d70" fontSize="8" textAnchor="middle">GPIO25 OUT · GPIO26 IN</text>
                </g>

                <g>
                  <rect x="365" y="35" width="92" height="32" rx="8" fill="#0b2329" stroke="#1d7786" />
                  <text x="411" y="55" fill="#8debf2" fontSize="11" textAnchor="middle" fontWeight="700">{noEcho ? 'SEM ECO' : `${formatCm(distance)} cm`}</text>
                </g>
              </svg>
            </div>
            <div className="flex min-h-[52px] flex-wrap gap-x-4 gap-y-2 px-4 py-3 text-[9px] text-white">
              <span className="inline-flex items-center gap-1.5"><i className="h-[3px] w-[13px] rounded bg-[#f05d5e]" />5V → VCC</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-[3px] w-[13px] rounded bg-[#35d39a]" />GPIO25 → TRIG</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-[3px] w-[13px] rounded bg-[#f5c84c]" />GPIO26 → ECHO</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-[3px] w-[13px] rounded bg-[#92a1a6]" />GND → GND</span>
              <span className="inline-flex items-center gap-1.5">ESP32 DevKit + HC-SR04</span>
             
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)_minmax(0,1.18fr)]" id="fluxo">
          <div className="min-w-0 overflow-hidden rounded-[15px] border border-[#FFD000] bg-[#0b1418] shadow-[0_10px_32px_rgba(0,0,0,0.12)]">
            <div className="flex min-h-[67px] items-center justify-between gap-2 px-4 py-3">
              <div><p className="mb-1.5 text-[10px] font-extrabold tracking-[.17em] text-white">SENSOR DE DISTÂNCIA</p></div>
            </div>
            <div className="mx-4 mb-4 flex items-center justify-between gap-2 rounded-[10px] border border-[#FFD000]  px-3.5 py-3">
              <div className="flex flex-col"><span className="text-[10px] text-white">Distância até a água</span><strong className="mt-0.5 font-mono text-[26px] font-bold leading-tight tracking-[-.06em] text-[#e5f0f0]">{noEcho ? '—' : formatCm(distance)}<small className="ml-1 font-sans text-[10px] font-medium tracking-normal text-[#7d9297]">cm</small></strong></div>
              <span className="text-[19px] text-white " aria-hidden="true">↕</span>
              <div className="flex flex-col text-right"><span className="text-[10px] text-[#83969a]">Referência</span><strong className="mt-0.5 font-mono text-[19px] font-bold leading-tight text-[#90a3a7]">150<small className="ml-1 font-sans text-[10px] font-medium text-[#7d9297]">cm</small></strong></div>
            </div>
            <label className="mx-4 mb-2 py-10 flex justify-between text-[10px] text-[#a9b8ba]" htmlFor="distance-range"><span>Simular distância medida</span><span className="text-[#63777c]">0–200 cm</span></label>
            <input id="distance-range" className="mx-4 block h-1.5 w-[calc(100%-32px)] cursor-pointer appearance-none rounded-full bg-gradient-to-r from-[#00d5e8] via-[#168697] to-[#854c51] accent-[#00d5e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00d5e8] [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#0d1b20] [&::-webkit-slider-thumb]:bg-[#00d5e8] [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_#00d5e8,0_0_9px_rgba(0,213,232,0.5)] [&::-moz-range-thumb]:h-[9px] [&::-moz-range-thumb]:w-[9px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[#0d1b20] [&::-moz-range-thumb]:bg-[#00d5e8]" type="range" min="0" max="200" step="1" value={distance} onChange={(event) => setDistance(Number(event.target.value))} aria-label="Distância simulada do sensor em centímetros" />
            <div className="mx-4 mb-4 mt-1.5 flex justify-between font-mono text-[9px] text-white"><span>0</span><span>50</span><span>100</span><span className="text-[#b7a35c]">150 limite</span><span>200</span></div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-[15px] border border-[#FFD000] bg-[#0b1418] shadow-[0_10px_32px_rgba(0,0,0,0.12)]">
            <div className="flex min-h-[67px] items-center justify-between gap-2 px-4 py-3">
              <div><p className="mb-1.5 text-[10px] font-extrabold tracking-[.17em] text-white">LEITURA LOCAL</p><h2 className="m-0 text-sm font-bold text-[#eaf2f2]">Nível calculado</h2></div>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1.5 text-[8px] font-black tracking-[.08em] ${risk.badgeClass}`}><i className="text-[11px] not-italic">{risk.icon}</i>{risk.label}</span>
            </div>
            <div className="flex min-h-[185px] items-center justify-around gap-3 px-3 pb-2 pt-1 sm:gap-[18px] sm:px-4">
              <div className="flex w-[100px] shrink-0 flex-col items-center justify-end self-stretch pt-3" aria-label={currentLevel === null ? 'Nível de água inválido' : `Tanque preenchido em ${Math.round(fillPercent)} por cento`}>
                <div className="mb-1.5 flex w-[72px] items-center justify-center gap-1 text-[8px] tracking-[.06em] text-[#7e979b]"><span className="tracking-[-3px] text-[10px] text-[#00c9d7]">)))</span><span>HC-SR04</span></div>
                <div className="relative h-[140px] w-[75px] overflow-hidden rounded-b-xl rounded-t-md border-2 border-t-4 border-[#466269] bg-[#0c1519]">
                  <div className="absolute inset-x-0 bottom-0 min-h-[2px] overflow-hidden border-t-2 border-[#00d5e8] bg-gradient-to-t from-[#007190]/70 to-[#00d5e8]/60 transition-[height] duration-300" style={{ height: `${fillPercent}%` }}>
                    <div className="absolute -inset-x-[25%] -top-1 h-[9px] animate-pulse rounded-[50%] bg-white/40" />
                    <div className="absolute -inset-x-[25%] top-0 h-[9px] animate-pulse rounded-[50%] bg-white/20 [animation-delay:-1s]" />
                  </div>
                  <span className="absolute right-0.5 top-[29px] z-10 bg-[#0b1216]/80 px-0.5 font-mono text-[7px] text-[#93a4a7]">100 cm</span>
                  <span className="absolute right-0.5 top-[65px] z-10 bg-[#0b1216]/80 px-0.5 font-mono text-[7px] text-[#93a4a7]">60 cm</span>
                  <span className="absolute bottom-1 right-0.5 z-10 bg-[#0b1216]/80 px-0.5 font-mono text-[7px] text-[#93a4a7]">0</span>
                </div>
                <div className="mt-0.5 h-1 w-[84px] rounded bg-[#466269]" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <span className="text-[10px] text-[#83969a]">Nível da água</span>
                <strong className="mb-1 whitespace-nowrap font-mono text-[34px] font-bold leading-none tracking-[-.08em] text-[#ecf8f8] sm:text-[39px]">{currentLevel === null ? '—' : formatCm(currentLevel)}<small className="ml-1 font-sans text-[11px] font-medium tracking-normal text-[#7f959a]">cm</small></strong>
                <span className={`min-h-[29px] text-[9px] leading-[1.45] ${risk.textClass}`}>{risk.description}</span>
                <div className="mt-3 flex w-full items-center justify-between gap-1 rounded-md border border-[#26383d] bg-[#0c1519] px-2 py-2 font-mono text-[8px] text-[#819397] sm:text-[9px]">
                  <span>{REFERENCE_HEIGHT_CM} cm</span><b className="font-normal text-[#52676b]">−</b><span>{noEcho ? '—' : `${formatCm(distance)} cm`}</span><b className="font-normal text-[#52676b]">=</b><strong className="whitespace-nowrap font-bold text-[#bcebed]">{currentLevel === null ? '—' : `${formatCm(currentLevel)} cm`}</strong>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 border-t border-[#203138] px-3.5 py-2.5 text-[8px] text-[#829297]">
              <span className="inline-flex items-center gap-1"><i className="h-[7px] w-[7px] rounded-full bg-[#00cdbb]" />Normal ≤ 60 cm</span>
              <span className="inline-flex items-center gap-1"><i className="h-[7px] w-[7px] rounded-full bg-[#f0bd4c]" />Atenção &gt; 60 cm</span>
              <span className="inline-flex items-center gap-1"><i className="h-[7px] w-[7px] rounded-full bg-[#eb6464]" />Crítico &gt; 100 cm</span>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-[15px] border border-[#FFD000] bg-[#0b1418] shadow-[0_10px_32px_rgba(0,0,0,0.12)] lg:col-span-2 xl:col-span-1">
            <div className="flex min-h-[67px] items-center justify-between gap-2 px-4 py-3">
              <div><p className="mb-1.5 text-[10px] font-extrabold tracking-[.17em] text-white">HISTÓRICO EM MEMÓRIA</p><h2 className="m-0 text-sm font-bold text-[#eaf2f2]">Leituras da sessão</h2></div>
              <span className="whitespace-nowrap rounded-md border border-[#293d43] bg-[#152127] px-2 py-1 text-[9px] font-extrabold text-[#91a3a7]">{readings.length} pontos</span>
            </div>
            <div className="px-2.5">
              <svg className="block h-[208px] w-full" viewBox="0 0 540 220" role="img" aria-label="Gráfico local do nível da água">
                <line x1="40" y1="44" x2="510" y2="44" stroke="#a23d43" strokeDasharray="5 6" opacity="0.65" />
                <line x1="40" y1="88" x2="510" y2="88" stroke="#aa842a" strokeDasharray="5 6" opacity="0.68" />
                <line x1="40" y1="123" x2="510" y2="123" stroke="#238a80" strokeDasharray="5 6" opacity="0.62" />
                <line x1="40" y1="176" x2="510" y2="176" stroke="#35474e" />
                <line x1="40" y1="44" x2="40" y2="176" stroke="#35474e" />
                <text x="5" y="48" fill="#c2797a" fontSize="10">150</text><text x="11" y="92" fill="#c7ac64" fontSize="10">100</text><text x="16" y="127" fill="#65afa2" fontSize="10">60</text><text x="16" y="180" fill="#819499" fontSize="10">0</text>
                <text x="478" y="38" fill="#c2797a" fontSize="9">150 cm</text><text x="482" y="82" fill="#c7ac64" fontSize="9">100 cm</text>
                {readings.length > 0 && <polyline points={chartPoints} fill="none" stroke="#00d5e8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
                {readings.slice(-12).map((reading, index, visible) => {
                  const x = visible.length === 1 ? 275 : 40 + index * (470 / (visible.length - 1));
                  const y = 176 - (reading.level / REFERENCE_HEIGHT_CM) * 132;
                  return <circle key={reading.id} cx={x} cy={y} r="4.5" fill="#00d5e8" stroke="#0c171c" strokeWidth="2" />;
                })}
                {readings.length === 0 && <text x="275" y="118" fill="#77898e" textAnchor="middle" fontSize="12">Aguardando a primeira leitura local…</text>}
                <text x="40" y="202" fill="#697b80" fontSize="9">MAIS ANTIGA</text><text x="510" y="202" fill="#697b80" fontSize="9" textAnchor="end">MAIS RECENTE</text>
              </svg>
            </div>
            <div className="flex justify-between gap-2 px-4 pb-3 pt-0.5 text-[9px] text-[#7f9094]"><span className="inline-flex items-center gap-1.5"><i className="h-[3px] w-[14px] rounded bg-[#00d5e8]" />nível em cm</span><span>Última amostra: {lastReading ? `${formatCm(lastReading.level)} cm` : '—'}</span></div>
          </div>
        </section>
      </main>

      <footer>
        <Footer/>
      </footer>
    </div>
  );
}
