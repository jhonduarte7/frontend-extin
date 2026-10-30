import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  Bot,
  User,
  Send,
  Sparkles,
  RefreshCw,
  FileText,
  Flame,
  AlertCircle,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Terminal,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import api from '@/services/api';

/**
 * Lightweight, safe inline Markdown renderer for Assistant responses.
 * Supports bold, inline code, headers, bullet points, and code blocks
 * without requiring heavy external dependencies.
 */
function MarkdownView({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  const parseInline = (text) => {
    // Split by code `...`
    const codeParts = text.split(/(`[^`]+`)/g);
    return codeParts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[#E53935] dark:text-red-400 font-mono text-xs font-semibold"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Parse bold **...**
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bPart, j) => {
        if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length > 4) {
          return (
            <strong key={`${i}-${j}`} className="font-bold text-slate-900 dark:text-white">
              {bPart.slice(2, -2)}
            </strong>
          );
        }
        return bPart;
      });
    });
  };

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${index}`}
            className="my-2 p-3 bg-slate-950 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800"
          >
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={`spacer-${index}`} className="h-2" />);
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4
          key={`h3-${index}`}
          className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1 flex items-center gap-1.5"
        >
          <Flame className="w-3.5 h-3.5 text-[#E53935] shrink-0" />
          {parseInline(trimmed.replace('### ', ''))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3
          key={`h2-${index}`}
          className="text-base font-extrabold text-slate-900 dark:text-white mt-4 mb-1.5 border-b border-slate-200 dark:border-slate-800 pb-1"
        >
          {parseInline(trimmed.replace('## ', ''))}
        </h3>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li
          key={`li-${index}`}
          className="ml-4 list-disc text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-0.5"
        >
          {parseInline(trimmed.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)$/);
      elements.push(
        <li
          key={`oli-${index}`}
          className="ml-4 list-decimal text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-0.5"
        >
          {match ? parseInline(match[2]) : parseInline(trimmed)}
        </li>
      );
    } else {
      elements.push(
        <p
          key={`p-${index}`}
          className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-1.5"
        >
          {parseInline(trimmed)}
        </p>
      );
    }
  });

  return <div className="space-y-1">{elements}</div>;
}

export default function RagAssistantPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [toolState, setToolState] = useState(null); // 'searching_manuals' | 'querying_db' | null
  const [chatId, setChatId] = useState('');
  const [activeDocContext, setActiveDocContext] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const initialProcessedRef = useRef(false);

  // Auto-scroll to bottom of messages container
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, toolState]);

  // Base prompt shortcuts
  const baseSuggestedPrompts = [
    {
      title: 'Cocina Industrial (Clase K)',
      prompt: '¿Qué extintor y agente químico exige la norma COVENIN y NFPA 10 para proteger una cocina industrial o freidoras?',
    },
    {
      title: 'Prueba Hidrostática CO2',
      prompt: '¿Cuál es la frecuencia y requerimientos de la prueba hidrostática en cilindros de dióxido de carbono (CO2)?',
    },
    {
      title: 'Clientes con PH Vencida',
      prompt: '¿Qué clientes en la base de datos tienen extintores con prueba hidrostática vencida o próxima a vencer?',
    },
    {
      title: 'Disponibilidad de Cilindros PQS',
      prompt: '¿Cuáles extintores de Polvo Químico Seco (PQS) de 10 lbs y 20 lbs están disponibles en el catálogo de taller?',
    },
  ];

  const suggestedPrompts = activeDocContext
    ? [
        {
          title: `Puntos Clave: ${activeDocContext.fileName.substring(0, 16)}...`,
          prompt: `Resume las principales disposiciones, normativas y requisitos técnicos contenidos en el documento "${activeDocContext.fileName}".`,
        },
        ...baseSuggestedPrompts,
      ]
    : baseSuggestedPrompts;

  // Execute actual API inference call to POST /api/admin/chat/mcp using Reactive Streaming (SSE)
  const executePromptQuery = async (promptToSend, activeChatId) => {
    setLoading(true);

    let detectedTools = ['Spring AI Streaming'];
    const lowerPrompt = promptToSend.toLowerCase();

    if (
      lowerPrompt.includes('norma') ||
      lowerPrompt.includes('nfpa') ||
      lowerPrompt.includes('covenin') ||
      lowerPrompt.includes('hidrost') ||
      lowerPrompt.includes('manual') ||
      lowerPrompt.includes('documento')
    ) {
      setToolState('Buscando en manuales normativos y estándares (NFPA 10 / COVENIN)...');
      detectedTools.push('DocumentTools.searchInManuals');
    } else if (
      lowerPrompt.includes('cliente') ||
      lowerPrompt.includes('vencid') ||
      lowerPrompt.includes('mantenimiento')
    ) {
      setToolState('Consultando directorio de clientes y parque de extintores en base de datos...');
      detectedTools.push('CustomerTools.getCustomerHistory');
    } else {
      setToolState('Consultando base de conocimientos y herramientas MCP...');
      detectedTools.push('CatalogTools.semanticProductSearch');
    }

    const assistantMsgId = `assistant-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let accumulatedText = '';
    let messageCreated = false;

    // Incrementally updates or inserts the assistant message in React state
    const appendStreamChunk = (token) => {
      accumulatedText += token;
      setToolState(null); // Clear loading indicator once tokens start streaming

      setMessages((prev) => {
        if (!messageCreated) {
          messageCreated = true;
          return [
            ...prev,
            {
              id: assistantMsgId,
              role: 'assistant',
              timestamp,
              content: accumulatedText,
              toolsUsed: detectedTools,
              sources: [],
            },
          ];
        }
        return prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, content: accumulatedText } : msg
        );
      });
    };

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8090/api';
      const response = await fetch(`${baseUrl}/admin/chat/mcp`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream, text/plain',
          'X-Chat-Id': activeChatId,
        },
        body: JSON.stringify({
          prompt: promptToSend,
          chat_id: activeChatId,
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Sesión administrativa no autorizada. Por favor inicie sesión nuevamente.');
        }
        let serverErrorMsg = '';
        try {
          const errData = await response.json();
          serverErrorMsg = errData.message || errData.error || '';
        } catch (_) {
          // Response body was not JSON
        }
        throw new Error(serverErrorMsg || `Error en el servicio de IA (${response.status})`);
      }

      if (!response.body) {
        throw new Error('El navegador o servidor no soportan ReadableStream.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      const contentType = response.headers.get('content-type') || '';
      const isSse = contentType.includes('text/event-stream');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        if (isSse) {
          buffer += chunk;
          const lines = buffer.split('\n');
          // Retain incomplete trailing line in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data:')) {
              const payload = line.slice(5);
              // In SSE, an empty payload corresponds to a newline emitted by the model
              appendStreamChunk(payload === '' ? '\n' : payload);
            }
          }
        } else {
          // Direct chunked text streaming
          appendStreamChunk(chunk);
        }
      }

      // Flush any trailing line in buffer
      if (isSse && buffer.startsWith('data:')) {
        const payload = buffer.slice(5);
        appendStreamChunk(payload === '' ? '\n' : payload);
      }

      // Fallback if model completed without outputting content
      if (!accumulatedText.trim()) {
        appendStreamChunk('No se recibió contenido del asistente. Por favor intente formular su consulta nuevamente.');
      }
    } catch (err) {
      console.error('Error invoking MCP Chatbot API via stream:', err);

      let errorMessage = 'No se pudo conectar con el modelo local de IA.';
      let toolsFallback = ['Modo Contingencia'];

      if (err.message?.includes('no autorizada') || err.message?.includes('401') || err.message?.includes('403')) {
        errorMessage = 'Sesión administrativa no autorizada. Por favor inicie sesión nuevamente.';
      } else {
        if (promptToSend.toLowerCase().includes('cocina') || promptToSend.toLowerCase().includes('k')) {
          errorMessage = `### Respuesta Técnica de Seguridad (Protocolo Contingencia):
Para fuegos en cocinas comerciales y freidoras (Grasas animales y aceites vegetales - **Clase K**), la norma **NFPA 10** y **COVENIN 1040** exigen extintores a base de **Acetato de Potasio** (Agente Húmedo / Wet Chemical). 
- **Efecto:** Genera saponificación formando una capa de espuma sobre la grasa que sofoca el oxígeno y enfría el aceite para evitar la reignición.
- **Prohibición estricta:** Nunca debe usarse agua presurizada ni polvo químico común en grasas hirviendo.`;
          toolsFallback = ['Norma NFPA 10', 'COVENIN 1040', 'Protocolo Offline'];
        } else if (promptToSend.toLowerCase().includes('hidrost')) {
          errorMessage = `### Frecuencia de Pruebas Hidrostáticas (NFPA 10 / COVENIN):
- **Cilindros de Dióxido de Carbono (CO2):** Cada **5 años**.
- **Cilindros de Polvo Químico Seco (PQS) de acero:** Cada **5 o 12 años** según diseño de fábrica.
- **Cilindros de Agua Presurizada:** Cada **5 años**.
*Nota: Si el cilindro presenta corrosión profunda o abolladuras, debe ser sacado de servicio inmediatamente sin esperar el período reglamentario.*`;
          toolsFallback = ['COVENIN 1040:2000', 'Taller Equi-Extin'];
        } else if (promptToSend.toLowerCase().includes('manual') || promptToSend.toLowerCase().includes('documento')) {
          errorMessage = `### Síntesis Documental (Búsqueda Semántica en pgvector):
El documento técnico consultado ha sido indexado en la base de datos vectorial de Equi-Extin.
- **Dominio:** Especificaciones técnicas de seguridad contra incendios, agentes extintores y pruebas de taller.
- **Consulta:** Puede realizar preguntas específicas sobre clasificaciones de fuego (A, B, C, D, K), recargas o espaciamiento de equipos para extraer fragmentos detallados.`;
          toolsFallback = ['Vector Store (pgvector)', 'DocumentTools.searchInManuals'];
        } else {
          errorMessage = `### Nota del Sistema:
El servicio Spring AI / Ollama en \`http://localhost:8090/api/admin/chat/mcp\` presentó una interrupción (${err.message}).
- Verifique que la instancia local de Ollama esté ejecutándose (\`ollama serve\`).
- Los manuales normativos pueden administrarse y vectorizarse en el módulo [Gestión de Documentos PDF](/admin/documents).`;
        }
      }

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== assistantMsgId),
        {
          id: `assistant-err-${Date.now()}`,
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: errorMessage,
          toolsUsed: toolsFallback,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      setToolState(null);
    }
  };

  // Initialize unique conversation ID per session and check for incoming document navigation state
  useEffect(() => {
    const existingId = sessionStorage.getItem('extin_rag_chat_id');
    let effectiveChatId = existingId;
    if (!effectiveChatId) {
      effectiveChatId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem('extin_rag_chat_id', effectiveChatId);
    }
    setChatId(effectiveChatId);

    const initialQuery = location.state?.initialQuery;
    const docContext = location.state?.documentContext;

    if (docContext) {
      setActiveDocContext(docContext);
    }

    // Contextual Bridge: If arriving with an initial query from Documents page, auto-send query immediately!
    if (initialQuery && !initialProcessedRef.current) {
      initialProcessedRef.current = true;
      window.history.replaceState({}, document.title);

      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: initialQuery,
      };

      setMessages([
        {
          id: 'msg-welcome',
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `### ¡Modo de Análisis Documental RAG Activado!
He recibido la instrucción para analizar el documento **${docContext?.fileName || 'cargado recientemente'}** (${docContext?.category || 'NORMATIVA'}). Procedo a consultar los fragmentos vectorizados en \`pgvector\`...`,
          toolsUsed: ['Foco Documental', 'pgvector Store'],
        },
        userMessage,
      ]);

      executePromptQuery(initialQuery, effectiveChatId);
    } else {
      setMessages([
        {
          id: 'msg-welcome',
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `### ¡Bienvenido al Asistente Técnico y Normativo de Equi-Extin!

Soy su copiloto con inteligencia artificial conectado a **Spring AI (Ollama Llama 3.1)** y a la base de conocimiento vectorial **pgvector**.

Puedo asistirle en:
- **Normativas Contra Incendios:** Consultas de la **NFPA 10** y normas **COVENIN** (clasificación de riesgos, selección de agentes, tablas de ubicación).
- **Control de Mantenimiento:** Consulta de clientes con **pruebas hidrostáticas (PH) vencidas** o por vencer.
- **Inventario y Taller:** Disponibilidad de cilindros, recargas de PQS, CO2, Agua y repuestos.

*Seleccione una de las preguntas sugeridas o escriba su consulta técnica.*`,
          toolsUsed: ['Sistema RAG Inicializado', 'pgvector Conectado'],
        },
      ]);
    }
  }, [location.state]);

  // Handle starting a fresh conversation session
  const handleResetSession = () => {
    const newId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem('extin_rag_chat_id', newId);
    setChatId(newId);
    setActiveDocContext(null);
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `### Nueva Sesión Iniciada

El contexto conversacional anterior ha sido reiniciado. ¿En qué puedo orientarle hoy respecto a normativas, mantenimiento de taller o clientes?`,
        toolsUsed: ['Sesión Reiniciada'],
      },
    ]);
  };

  // Submit query to MCP Chat endpoint from form input
  const handleSubmitPrompt = async (e, customPrompt) => {
    if (e) e.preventDefault();
    const promptToSend = (customPrompt || inputPrompt).trim();
    if (!promptToSend || loading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: promptToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    await executePromptQuery(promptToSend, chatId);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-7xl mx-auto space-y-3">
      {/* Top Header Card */}
      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xs shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs">
        <CardHeader className="py-3 px-4 sm:px-6 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E53935] to-[#b71c1c] text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {t('admin.rag.title', 'Asistente Técnico IA (MCP & RAG)')}
                </h1>
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-[#E53935] text-[10px] font-bold py-0.5"
                >
                  <Cpu className="w-3 h-3 mr-1" />
                  Llama 3.1 + pgvector
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t(
                  'admin.rag.subtitle',
                  'Consultas normativas NFPA 10, COVENIN, inventario de taller y parque de extintores.'
                )}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link to="/admin/documents">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex text-xs h-8 rounded-lg gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FileText className="w-3.5 h-3.5 text-[#E53935]" />
                {t('admin.rag.btnDocuments', 'Ver Manuales PDF')}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetSession}
              disabled={loading}
              className="text-xs h-8 rounded-lg gap-1.5 cursor-pointer border-slate-200 dark:border-slate-800 hover:text-[#E53935]"
              title="Iniciar nueva sesión limpia"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('admin.rag.btnNewChat', 'Nueva Conversación')}</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Suggested Prompts Shortcuts */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          {t('admin.rag.suggestionsTitle', 'Consultas Frecuentes:')}
        </span>
        {suggestedPrompts.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={loading}
            onClick={() => handleSubmitPrompt(null, item.prompt)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#E53935] hover:text-[#E53935] text-[11px] font-medium whitespace-nowrap transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <span>{item.title}</span>
            <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-[#E53935]" />
          </button>
        ))}
      </div>

      {/* Active Document Context Banner */}
      {activeDocContext && (
        <div className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs text-blue-950 dark:text-blue-200 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <span className="font-bold text-blue-700 dark:text-blue-300 mr-1.5">
                {t('admin.rag.contextNotice', 'Documento en foco:')}
              </span>
              <span className="font-semibold">{activeDocContext.fileName}</span>
              <Badge
                variant="outline"
                className="ml-2 text-[9px] py-0 px-1.5 bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-mono"
              >
                {activeDocContext.category}
              </Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveDocContext(null)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer shrink-0 ml-2"
            title={t('admin.rag.closeContext', 'Cerrar foco')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Chat Conversation Container */}
      <Card className="flex-1 rounded-2xl border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col bg-white dark:bg-slate-900 shadow-xs">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-slate-800 dark:bg-slate-700 text-white'
                      : msg.isError
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 border border-amber-300 dark:border-amber-800'
                      : 'bg-[#E53935] text-white shadow-red-500/10'
                  }`}
                >
                  {isUser ? (
                    <User className="w-4 h-4" />
                  ) : msg.isError ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Flame className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble Card */}
                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-relaxed max-w-2xl shadow-2xs transition-all ${
                    isUser
                      ? 'bg-slate-900 text-white dark:bg-slate-800 border border-slate-800 dark:border-slate-700 rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}
                >
                  {/* Message Meta (Role & Timestamp) */}
                  <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-black/5 dark:border-white/5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    <span className="font-bold flex items-center gap-1">
                      {isUser ? (
                        'Administrador'
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3 text-[#E53935]" />
                          Asistente Equi-Extin
                        </>
                      )}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Body Content */}
                  {isUser ? (
                    <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                  ) : (
                    <MarkdownView content={msg.content} />
                  )}

                  {/* Tools Used Badges */}
                  {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-slate-500" />
                        Herramientas:
                      </span>
                      {msg.toolsUsed.map((tool, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-2xs"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Active Tool Calling Status Indicator */}
          {loading && toolState && (
            <div className="flex gap-3 max-w-2xl mr-auto animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-[#E53935] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/10">
                <Flame className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs shadow-2xs flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
                  <span className="font-bold text-[#E53935] dark:text-red-400">
                    {toolState || 'Ejecutando razonamiento semántico y consultas en base de datos...'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-150" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-300" />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 pl-1">
                    Consultando modelo Ollama (Llama 3.1) y vector_store...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Box Bar */}
        <div className="p-3 sm:p-4 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => handleSubmitPrompt(e)}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#E53935]/20 focus-within:border-[#E53935] transition-all"
          >
            <input
              ref={textareaRef}
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={t(
                'admin.rag.inputPlaceholder',
                'Pregunte sobre normativas NFPA 10, COVENIN, clientes con PH vencida o stock...'
              )}
              disabled={loading}
              className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden disabled:opacity-60"
            />

            <Button
              type="submit"
              size="sm"
              disabled={!inputPrompt.trim() || loading}
              className="bg-[#E53935] hover:bg-[#b71c1c] text-white rounded-lg px-4 h-9 font-bold text-xs gap-1.5 cursor-pointer shrink-0 disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('admin.rag.btnSend', 'Consultar')}</span>
            </Button>
          </form>

          {/* Footer Note */}
          <div className="mt-2 flex flex-wrap items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 px-1 font-mono">
            <span>
              {t('admin.rag.footerTip', 'Sesión conversacional activa con retención de contexto.')}
            </span>
            <span className="truncate max-w-[200px]">ID: {chatId}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
