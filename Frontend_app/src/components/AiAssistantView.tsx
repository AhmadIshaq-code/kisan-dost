import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  RotateCcw, 
  Wrench,
  Activity,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Droplets,
  CloudRain,
  Bug,
  DollarSign,
  Database,
  ChevronRight,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ChatMessage, FarmerProfile } from '../types';
import { INITIAL_CHAT_MESSAGES, QUICK_PROMPTS } from '../data/mockData';

interface AiAssistantViewProps {
  farmer: FarmerProfile;
  initialPromptText?: string;
  onClearInitialPrompt?: () => void;
}

interface AgentFlowState {
  step1: 'completed' | 'active' | 'pending';
  step2: 'completed' | 'active' | 'pending';
  step3: 'completed' | 'active' | 'pending';
  step4: 'completed' | 'active' | 'pending';
  step5: 'completed' | 'active' | 'pending';
  activeSpecialist: string;
  activeTool: string;
}

// Inline Markdown & Formatting Helper
const formatInlineText = (text: string): React.ReactNode => {
  // Regex to split by bold (**text**), code (`text`), and italic (*text*)
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-[#1B4332]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-[#EAF2EA] font-mono text-[11px] text-[#2D6A4F]">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i} className="italic text-[#2D4030]">{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

// Generic Dynamic Response Renderer for AI Messages
const FormattedAiContent: React.FC<{ content: string; isStreaming?: boolean }> = ({ content, isStreaming }) => {
  if (!content) return null;

  // Split content into lines and group into structured blocks
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];

  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. Empty lines
    if (!line) {
      i++;
      continue;
    }

    // 2. Markdown Tables (starts and ends with '|')
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      // Filter out divider lines (like |---|---|)
      const nonDividerLines = tableLines.filter(l => !l.match(/^\|?[-:\s|]+\|?$/));
      if (nonDividerLines.length > 0) {
        const headerRow = nonDividerLines[0];
        const headers = headerRow.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        const dataRows = nonDividerLines.slice(1).map(r => 
          r.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
        );

        // Check if this is a weather table (contains 'day' or 'temp' or 'rain')
        const isWeatherTable = headers.some(h => /day|date|temp|rain|mausam/i.test(h));
        
        blocks.push(
          <div key={`table-${blockKey++}`} className="my-3 space-y-2">
            {isWeatherTable && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] px-1">
                <CloudRain className="w-4 h-4 text-[#2D6A4F]" />
                <span>Mausam Forecast Table</span>
              </div>
            )}
            <div className="overflow-x-auto rounded-xl border border-[#D8E4D8] bg-white shadow-xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#EAF2EA] border-b border-[#D8E4D8] text-[#1B4332]">
                    {headers.map((h, hIdx) => (
                      <th key={hIdx} className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
                        {formatInlineText(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAF2EA]">
                  {dataRows.map((row, rIdx) => {
                    const isTotalRow = row.some(c => /total|summary|mizan/i.test(c));
                    return (
                      <tr 
                        key={rIdx} 
                        className={isTotalRow 
                          ? "bg-[#EAF2EA]/70 font-bold text-[#1B4332] border-t-2 border-[#C5DBC5]" 
                          : "hover:bg-[#F7FAF7] text-[#2D4030] transition-colors"
                        }
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3.5 py-2 whitespace-nowrap">
                            {formatInlineText(cell)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      continue;
    }

    // 3. Safety Warning / Disclaimer Boxes (Pesticides, unverified dosage, safety policy)
    const isSafetyHeading = /^\s*(\*\*|###\s*)?(safety notes?|warning|hifazati tadabeer|muhtat rahain|policy)/i.test(line);
    const isUnverifiedDosageWarning = /unverified|certified agriculture officer|product label|label instructions|kisan dost does not provide unverified/i.test(line);

    if (isSafetyHeading) {
      // Gather lines for this warning section
      const warningLines: string[] = [line];
      i++;
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('#') && !lines[i].trim().startsWith('|')) {
        warningLines.push(lines[i].trim());
        i++;
      }

      blocks.push(
        <div 
          key={`safety-${blockKey++}`} 
          className="my-3 p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] space-y-1.5 shadow-xs"
        >
          <div className="flex items-center gap-2 font-bold text-xs text-[#B45309]">
            <ShieldAlert className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>Hifazati Hidayat & Safety Advisory</span>
          </div>
          <div className="text-xs space-y-1 text-[#78350F] pl-6">
            {warningLines.map((wl, idx) => (
              <p key={idx} className="leading-relaxed">
                {formatInlineText(wl.replace(/^(\*\*|###\s*)?(safety notes?|warning):?\*?\*?/i, '').trim() || wl)}
              </p>
            ))}
          </div>
        </div>
      );
      continue;
    }

    // 4. Metric Key-Value Grouping (Yield, Revenue, Cost, Profit, Water Need)
    const metricMatch = line.match(/^[\*\-•]?\s*\*\*?(expected yield|expected paidawar|estimated revenue|estimated cost|estimated profit|munafa|water need|water requirement):?\*\*?\s*(.+)$/i);
    if (metricMatch) {
      const metricItems: { label: string; value: string; raw: string }[] = [];
      while (i < lines.length) {
        const curLine = lines[i].trim();
        const m = curLine.match(/^[\*\-•]?\s*\*\*?(expected yield|expected paidawar|estimated revenue|estimated cost|estimated profit|munafa|water need|water requirement):?\*\*?\s*(.+)$/i);
        if (m) {
          metricItems.push({ label: m[1].trim(), value: m[2].replace(/\*\*|`/g, '').trim(), raw: curLine });
          i++;
        } else {
          break;
        }
      }

      if (metricItems.length > 0) {
        blocks.push(
          <div key={`metrics-${blockKey++}`} className="my-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {metricItems.map((item, mIdx) => {
              const isProfit = /profit|munafa/i.test(item.label);
              const isRevenue = /revenue/i.test(item.label);
              const isCost = /cost/i.test(item.label);
              const isWater = /water/i.test(item.label);

              let cardStyle = "bg-white border-[#D8E4D8] text-[#1B4332]";
              let icon = <TrendingUp className="w-3.5 h-3.5 text-[#2D6A4F]" />;

              if (isProfit) {
                cardStyle = "bg-[#EAF5EA] border-[#A3D9A5] text-[#134E2E] ring-1 ring-[#A3D9A5]/50";
                icon = <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />;
              } else if (isRevenue) {
                cardStyle = "bg-[#F0F7FF] border-[#BFDBFE] text-[#1E3A8A]";
                icon = <DollarSign className="w-3.5 h-3.5 text-[#2563EB]" />;
              } else if (isCost) {
                cardStyle = "bg-[#FDF2F2] border-[#FECACA] text-[#991B1B]";
                icon = <DollarSign className="w-3.5 h-3.5 text-[#DC2626]" />;
              } else if (isWater) {
                cardStyle = "bg-[#F0FDFA] border-[#99F6E4] text-[#115E59]";
                icon = <Droplets className="w-3.5 h-3.5 text-[#0D9488]" />;
              }

              return (
                <div 
                  key={mIdx} 
                  className={`p-2.5 rounded-xl border shadow-xs flex flex-col justify-between ${cardStyle}`}
                >
                  <div className="flex items-center justify-between text-[11px] font-medium opacity-85">
                    <span className="capitalize">{item.label}</span>
                    {icon}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-bold truncate" title={item.value}>
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>
        );
        continue;
      }
    }

    // 5. Section Headings (### or **Heading**)
    const isHeading = line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ') ||
      (/^(\*\*|__[A-Z0-9\s/–-]+(\*\*|__):?)$/i.test(line) && line.length < 60);

    if (isHeading) {
      const headingText = line.replace(/^[#\*\s]+|[\*\s]+$/g, '').replace(/:$/, '');
      const isCropRecommendation = /primary recommendation|secondary recommendation|recommended crop|crop recommendation/i.test(headingText);
      const isPestHeading = /likely pest|pest \/ disease|treatment guidance|tashkhees/i.test(headingText);

      blocks.push(
        <div key={`h-${blockKey++}`} className="mt-3.5 mb-1.5 pt-1 border-t border-[#EAF2EA] first:border-t-0 first:mt-0">
          <div className="flex items-center gap-2">
            {isCropRecommendation && <Sprout className="w-4 h-4 text-[#2D6A4F]" />}
            {isPestHeading && <Bug className="w-4 h-4 text-[#B45309]" />}
            <h4 className="font-bold text-sm text-[#1B4332] tracking-tight">
              {headingText}
            </h4>
          </div>
        </div>
      );
      i++;
      continue;
    }

    // 6. Bullet Lists (- or * or •)
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      const listItems: string[] = [];
      while (i < lines.length) {
        const cur = lines[i].trim();
        if (cur.startsWith('- ') || cur.startsWith('* ') || cur.startsWith('• ')) {
          listItems.push(cur.slice(2).trim());
          i++;
        } else {
          break;
        }
      }

      blocks.push(
        <ul key={`list-${blockKey++}`} className="my-2 space-y-1 pl-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#2D4030] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] shrink-0 mt-2" />
              <span>{formatInlineText(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 7. Controlled Dataset / Live Market Benchmark Note
    if (/controlled data|benchmark data|dataset price|controlled agricultural dataset/i.test(line)) {
      blocks.push(
        <div key={`dataset-note-${blockKey++}`} className="my-2 p-2 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-[11px] text-[#475569] flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
          <span>{formatInlineText(line)}</span>
        </div>
      );
      i++;
      continue;
    }

    // 8. Normal Paragraph
    blocks.push(
      <p key={`p-${blockKey++}`} className="text-xs sm:text-sm text-[#1B4332] leading-relaxed">
        {formatInlineText(line)}
      </p>
    );
    i++;
  }

  return (
    <div className="space-y-2">
      {blocks}
      {isStreaming && (
        <span className="inline-block w-2 h-3.5 bg-[#2D6A4F] animate-pulse ml-0.5 align-middle" />
      )}
    </div>
  );
};

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  farmer,
  initialPromptText,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => `kisan_web_${Date.now()}`);
  const [flowState, setFlowState] = useState<AgentFlowState>({
    step1: 'completed',
    step2: 'completed',
    step3: 'completed',
    step4: 'completed',
    step5: 'completed',
    activeSpecialist: 'Agronomy Agent',
    activeTool: 'Crop Advisor Tool',
  });
  const [activeTrail, setActiveTrail] = useState<string[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, activeTrail]);

  // If prompted from dashboard
  useEffect(() => {
    if (initialPromptText) {
      handleSendMessage(initialPromptText);
      onClearInitialPrompt?.();
    }
  }, [initialPromptText]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'farmer',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);
    setActiveTrail(['🤖 Kisan Dost Triage Agent']);

    // Set Initial flow state
    setFlowState({
      step1: 'active',
      step2: 'pending',
      step3: 'pending',
      step4: 'pending',
      step5: 'pending',
      activeSpecialist: 'Triage Agent',
      activeTool: 'Analyzing query & routing...',
    });

    // Create an empty AI message placeholder to receive streaming tokens
    const aiMsgId = `ai-${Date.now()}`;
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentTrail: ['🤖 Kisan Dost Triage Agent'],
      isStreaming: true,
    };

    setMessages((prev) => [...prev, initialAiMsg]);

    try {
      // 1. Try real Server-Sent Events (SSE) streaming endpoint
      const response = await fetch('http://localhost:8000/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          farmer: {
            name: farmer.name,
            district: farmer.location,
            province: 'Punjab',
            acres: farmer.farmSizeAcres,
            soil_type: farmer.soilType,
            season: farmer.season,
            water_availability: farmer.waterAvailability,
          },
          session_id: sessionId,
        }),
      });

      if (!response.ok || !response.body) {
        // Fallback to standard POST /api/chat if streaming is unavailable
        const standardRes = await fetch('http://localhost:8000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            farmer: {
              name: farmer.name,
              district: farmer.location,
              province: 'Punjab',
              acres: farmer.farmSizeAcres,
              soil_type: farmer.soilType,
              season: farmer.season,
              water_availability: farmer.waterAvailability,
            },
            session_id: sessionId,
          }),
        });

        if (!standardRes.ok) {
          const errorData = await standardRes.json().catch(() => ({}));
          throw new Error(errorData.detail || `Server responded with status ${standardRes.status}`);
        }

        const data = await standardRes.json();
        if (data.session_id) setSessionId(data.session_id);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? {
                  ...m,
                  text: data.response,
                  isStreaming: false,
                  agentToolTag: 'Agentic AI Verified',
                }
              : m
          )
        );

        setFlowState({
          step1: 'completed',
          step2: 'completed',
          step3: 'completed',
          step4: 'completed',
          step5: 'completed',
          activeSpecialist: 'Kisan Dost AI',
          activeTool: 'Execution Completed',
        });
        return;
      }

      // Real SSE Streaming reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';
      let currentTrail = ['🤖 Kisan Dost Triage Agent'];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const evt of events) {
          if (!evt.trim()) continue;
          const lines = evt.split('\n');
          let eventType = 'message';
          let dataStr = '';

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              dataStr = line.slice(6).trim();
            }
          }

          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);

            if (eventType === 'agent' && data.agent) {
              const formattedAgent = `🌾 ${data.agent}`;
              if (!currentTrail.includes(formattedAgent)) {
                currentTrail.push(formattedAgent);
                setActiveTrail([...currentTrail]);
              }
              setFlowState((prev) => ({
                ...prev,
                step1: 'completed',
                step2: 'completed',
                step3: 'active',
                activeSpecialist: data.agent,
              }));
            } else if (eventType === 'tool' && data.tool) {
              const formattedTool = `🔧 ${data.tool}`;
              if (!currentTrail.includes(formattedTool)) {
                currentTrail.push(formattedTool);
                setActiveTrail([...currentTrail]);
              }
              setFlowState((prev) => ({
                ...prev,
                step3: 'completed',
                step4: 'active',
                activeTool: data.tool,
              }));
            } else if (eventType === 'delta' && data.delta) {
              accumulatedText += data.delta;
              setFlowState((prev) => ({
                ...prev,
                step4: 'completed',
                step5: 'active',
              }));

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId
                    ? {
                        ...m,
                        text: accumulatedText,
                        agentTrail: [...currentTrail],
                        isStreaming: true,
                      }
                    : m
                )
              );
            } else if (eventType === 'done') {
              if (data.response) {
                accumulatedText = data.response;
              }
              if (data.session_id) {
                setSessionId(data.session_id);
              }

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId
                    ? {
                        ...m,
                        text: accumulatedText,
                        agentTrail: [...currentTrail],
                        isStreaming: false,
                        agentToolTag: 'Agentic AI Verified',
                      }
                    : m
                )
              );

              setFlowState({
                step1: 'completed',
                step2: 'completed',
                step3: 'completed',
                step4: 'completed',
                step5: 'completed',
                activeSpecialist: flowState.activeSpecialist || 'Kisan Dost Specialist',
                activeTool: flowState.activeTool || 'Execution Verified',
              });
            } else if (eventType === 'error') {
              throw new Error(data.error || 'Agentic AI stream returned an error');
            }
          } catch (e: any) {
            console.error('SSE JSON parse error:', e);
          }
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);

      setFlowState({
        step1: 'completed',
        step2: 'completed',
        step3: 'completed',
        step4: 'completed',
        step5: 'completed',
        activeSpecialist: 'System Notice',
        activeTool: 'Connection Error',
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                text: `⚠️ Server se rabta nahi ho saka. Barah-e-karam check karein ke FastAPI backend (http://localhost:8000) active hai. (${err.message || 'Network Error'})`,
                isStreaming: false,
                agentToolTag: 'Connection Notice',
              }
            : m
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_CHAT_MESSAGES);
    setSessionId(`kisan_web_${Date.now()}`);
    setActiveTrail([]);
    setFlowState({
      step1: 'completed',
      step2: 'completed',
      step3: 'completed',
      step4: 'completed',
      step5: 'completed',
      activeSpecialist: 'Agronomy Agent',
      activeTool: 'Crop Advisor Tool',
    });
  };

  return (
    <div id="ai-assistant-container" className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div id="ai-assistant-header" className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D8E4D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B4332] tracking-tight">
              Kisan Dost AI Assistant
            </h1>
            <span 
              id="ai-status-badge"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]"
            >
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              AI Assistant Online
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5C715C] mt-0.5">
            Your intelligent farming companion & agentic advisory
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="reset-demo-chat-btn"
            onClick={handleResetChat}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A5D4A] hover:text-[#1B4332] hover:bg-[#EAF2EA] rounded-lg transition-colors border border-[#D8E4D8] cursor-pointer disabled:opacity-50"
            title="Reset to showcase dialogue"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Split: Chat Area (left) + Agent Activity Panel (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chat Area */}
        <div 
          id="chat-area-card"
          className="lg:col-span-8 bg-white rounded-2xl border border-[#D8E4D8] shadow-xs flex flex-col h-[600px] sm:h-[640px] overflow-hidden"
        >
          {/* Messages Feed */}
          <div 
            id="chat-messages-feed"
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F7FAF7]"
          >
            {messages.map((msg) => {
              const isFarmer = msg.sender === 'farmer';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isFarmer ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-[95%] sm:max-w-[88%]">
                    {!isFarmer && (
                      <div className="w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 text-sm shadow-xs">
                        🌾
                      </div>
                    )}

                    <div className="space-y-2 flex-1">
                      {/* Active Agent Trail Indicator (Real Execution Pipeline) */}
                      {!isFarmer && msg.agentTrail && msg.agentTrail.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 text-[11px] font-medium text-[#2D6A4F] bg-[#EAF2EA]/60 border border-[#D8E4D8] px-2.5 py-1 rounded-lg w-fit">
                          {msg.agentTrail.map((node, idx) => (
                            <React.Fragment key={idx}>
                              {idx > 0 && <ChevronRight className="w-3 h-3 text-[#5C715C]" />}
                              <span>{node}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {/* Main Message Bubble */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed ${
                          isFarmer
                            ? 'bg-[#2D6A4F] text-white rounded-tr-none shadow-xs'
                            : 'bg-white text-[#1B4332] border border-[#D8E4D8] shadow-xs rounded-tl-none'
                        }`}
                      >
                        {isFarmer ? (
                          <p className="whitespace-pre-line font-normal">{msg.text}</p>
                        ) : (
                          <FormattedAiContent content={msg.text} isStreaming={msg.isStreaming} />
                        )}
                      </div>

                      {/* Tool Tag Demonstration */}
                      {!isFarmer && msg.agentToolTag && (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF2EA] border border-[#D8E4D8] text-[#2D6A4F] text-[11px] font-semibold">
                            <Wrench className="w-3 h-3 text-[#2D6A4F]" />
                            {msg.agentToolTag}
                          </span>
                        </div>
                      )}

                      {/* Legacy Recommended Crop Card for Initial Mock Data */}
                      {msg.recommendedCropCard && (
                        <div 
                          id="recommended-crop-card"
                          className="bg-[#F0F4F0] border border-[#D8E4D8] rounded-xl p-3.5 space-y-2 text-[#1B4332] shadow-xs"
                        >
                          <div className="flex items-center justify-between border-b border-[#D8E4D8] pb-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                              Recommended Crop
                            </span>
                            <span className="text-xs font-semibold text-[#2D6A4F] bg-white px-2 py-0.5 rounded-full border border-[#D8E4D8]">
                              Rabi Match
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-2xl">🌱</span>
                            <h4 className="text-base font-bold text-[#1B4332]">
                              {msg.recommendedCropCard.cropName}
                            </h4>
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                            <div className="bg-white p-2 rounded-lg border border-[#D8E4D8]">
                              <span className="text-[10px] text-[#5C715C] block">Expected Yield</span>
                              <span className="font-semibold text-[#1B4332]">
                                {msg.recommendedCropCard.expectedYield}
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-[#D8E4D8]">
                              <span className="text-[10px] text-[#5C715C] block">Estimated Profit</span>
                              <span className="font-bold text-[#2D6A4F]">
                                {msg.recommendedCropCard.estimatedProfit}
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-[#D8E4D8]">
                              <span className="text-[10px] text-[#5C715C] block">Water Need</span>
                              <span className="font-semibold text-[#1B4332]">
                                {msg.recommendedCropCard.waterNeed}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <span className="text-[10px] text-[#8DA08D] block px-1">
                        {msg.timestamp}
                      </span>
                    </div>

                    {isFarmer && (
                      <div className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0 text-xs font-semibold">
                        {farmer.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* In-Flight Agent Thinking indicator (only if no tokens arrived yet) */}
            {isProcessing && messages[messages.length - 1]?.text === '' && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 text-sm">
                  🌾
                </div>
                <div className="bg-white border border-[#D8E4D8] rounded-2xl rounded-tl-none p-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#2D6A4F]">
                    <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-ping" />
                    <span>Analyzing your farm & routing through specialist agents...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="p-2.5 bg-white border-t border-[#D8E4D8]">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs">
              <span className="text-[11px] font-semibold text-[#5C715C] px-1 shrink-0">
                Quick Prompts:
              </span>
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp.id}
                  id={qp.id}
                  onClick={() => handleSendMessage(qp.promptText)}
                  disabled={isProcessing}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-[#EAF2EA] hover:bg-[#DDE8DD] text-[#1B4332] border border-[#D8E4D8] font-medium text-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#D8E4D8]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Apni farming problem yahan likhein (e.g. Rabi crop, mausam, khad, bimari)..."
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#D8E4D8] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F] disabled:bg-[#F4F7F4] text-[#1B4332]"
              />
              <button
                id="chat-send-btn"
                type="submit"
                disabled={!inputValue.trim() || isProcessing}
                className="w-10 h-10 rounded-xl bg-[#2D6A4F] hover:bg-[#245840] disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                title="Send Message"
              >
                <span className="text-base font-bold">➤</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Agent Activity Panel */}
        <div 
          id="agent-activity-panel"
          className="lg:col-span-4 bg-white rounded-2xl p-5 border border-[#D8E4D8] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-[#D8E4D8]/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2D6A4F]" />
                <h3 className="font-bold text-[#1B4332] text-sm">
                  Agent Activity
                </h3>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#EAF2EA] text-[#2D6A4F] px-2 py-0.5 rounded-md border border-[#D8E4D8]">
                Multi-Agent
              </span>
            </div>

            {/* Architecture Steps */}
            <div className="space-y-3 relative">
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  flowState.step1 === 'completed'
                    ? 'bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]'
                    : 'bg-[#2D6A4F] text-white animate-pulse'
                }`}>
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1B4332]">
                    Request received
                  </p>
                  <p className="text-[11px] text-[#5C715C]">
                    Farmer context loaded ({farmer.location} • {farmer.farmSizeAcres} acres)
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  flowState.step2 === 'completed'
                    ? 'bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]'
                    : flowState.step2 === 'active'
                    ? 'bg-[#2D6A4F] text-white animate-pulse'
                    : 'bg-[#F4F7F4] text-[#8DA08D]'
                }`}>
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1B4332]">
                    Triage Agent
                  </p>
                  <p className="text-[11px] text-[#5C715C]">
                    Input guardrail verified & intent classified
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="pl-2.5 text-[#2D6A4F] text-xs font-mono">
                ↓
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  flowState.step3 === 'completed'
                    ? 'bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]'
                    : flowState.step3 === 'active'
                    ? 'bg-[#2D6A4F] text-white animate-pulse'
                    : 'bg-[#F4F7F4] text-[#8DA08D]'
                }`}>
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1B4332]">
                    {flowState.activeSpecialist}
                  </p>
                  <p className="text-[11px] text-[#5C715C]">
                    Specialist agent executing
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="pl-2.5 text-[#2D6A4F] text-xs font-mono">
                ↓
              </div>

              {/* Step 4 */}
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  flowState.step4 === 'completed'
                    ? 'bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]'
                    : flowState.step4 === 'active'
                    ? 'bg-[#2D6A4F] text-white animate-pulse'
                    : 'bg-[#F4F7F4] text-[#8DA08D]'
                }`}>
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1B4332]">
                    {flowState.activeTool}
                  </p>
                  <p className="text-[11px] text-[#5C715C]">
                    Function tool executed
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-center gap-3 pt-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  flowState.step5 === 'completed'
                    ? 'bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]'
                    : 'bg-[#F4F7F4] text-[#8DA08D]'
                }`}>
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1B4332]">
                    Response generated
                  </p>
                  <p className="text-[11px] text-[#5C715C]">
                    Synthesized for farmer in Urdu/Roman Urdu
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real Pipeline Trail Display */}
          <div className="mt-5 p-3 rounded-xl bg-[#F0F4F0] border border-[#D8E4D8] text-[11px] text-[#4A5D4A] space-y-1.5">
            <p className="font-semibold text-[#1B4332] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
              Agentic Architecture Pipeline:
            </p>
            <div className="font-mono text-[10px] text-[#2D6A4F] break-words">
              {activeTrail.length > 0
                ? activeTrail.join(' → ')
                : 'Farmer → Triage → Specialist Agent → Tool → Verified Output'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
