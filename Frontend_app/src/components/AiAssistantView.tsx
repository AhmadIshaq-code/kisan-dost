import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  ArrowDown, 
  Sparkles, 
  Cpu, 
  RotateCcw, 
  Wrench,
  Activity,
  Layers
} from 'lucide-react';
import { ChatMessage, FarmerProfile } from '../types';
import { INITIAL_CHAT_MESSAGES, QUICK_PROMPTS, QuickPrompt } from '../data/mockData';

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

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  farmer,
  initialPromptText,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [flowState, setFlowState] = useState<AgentFlowState>({
    step1: 'completed',
    step2: 'completed',
    step3: 'completed',
    step4: 'completed',
    step5: 'completed',
    activeSpecialist: 'Agronomy Agent',
    activeTool: 'Crop Advisor Tool',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // If prompted from dashboard
  useEffect(() => {
    if (initialPromptText) {
      handleSendMessage(initialPromptText);
      onClearInitialPrompt?.();
    }
  }, [initialPromptText]);

  const handleSendMessage = (textToSend?: string) => {
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

    // Find matching mock prompt or default
    const matched = QUICK_PROMPTS.find(
      (qp) => text.toLowerCase().includes(qp.label.toLowerCase().slice(3)) || 
              text.toLowerCase().includes(qp.promptText.toLowerCase().slice(0, 15))
    ) || QUICK_PROMPTS[0];

    const specialist = matched.specialist;
    const tool = matched.tool;
    const toolTag = `${specialist} → ${tool}`;

    // Simulate the Multi-Agent Step progression visually
    setFlowState({
      step1: 'active',
      step2: 'pending',
      step3: 'pending',
      step4: 'pending',
      step5: 'pending',
      activeSpecialist: specialist,
      activeTool: tool,
    });

    setTimeout(() => {
      setFlowState((prev) => ({ ...prev, step1: 'completed', step2: 'active' }));
    }, 300);

    setTimeout(() => {
      setFlowState((prev) => ({ ...prev, step2: 'completed', step3: 'active' }));
    }, 700);

    setTimeout(() => {
      setFlowState((prev) => ({ ...prev, step3: 'completed', step4: 'active' }));
    }, 1100);

    setTimeout(() => {
      setFlowState((prev) => ({ ...prev, step4: 'completed', step5: 'completed' }));
      
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: matched.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentToolTag: toolTag,
        recommendedCropCard: matched.cropCard,
        agentTrace: {
          triage: 'Triage Agent',
          specialist: specialist,
          tool: tool,
        },
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_CHAT_MESSAGES);
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
            Your intelligent farming companion
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="reset-demo-chat-btn"
            onClick={handleResetChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A5D4A] hover:text-[#1B4332] hover:bg-[#EAF2EA] rounded-lg transition-colors border border-[#D8E4D8] cursor-pointer"
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
          className="lg:col-span-8 bg-white rounded-2xl border border-[#D8E4D8] shadow-xs flex flex-col h-[580px] sm:h-[620px] overflow-hidden"
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
                  <div className="flex items-start gap-2 max-w-[90%] sm:max-w-[80%]">
                    {!isFarmer && (
                      <div className="w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 text-sm shadow-xs">
                        🌾
                      </div>
                    )}

                    <div className="space-y-2">
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed ${
                          isFarmer
                            ? 'bg-[#2D6A4F] text-white rounded-tr-none shadow-xs'
                            : 'bg-white text-[#1B4332] border border-[#D8E4D8] shadow-xs rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-line font-normal">{msg.text}</p>
                      </div>

                      {/* Tool Tag Demonstration */}
                      {msg.agentToolTag && (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF2EA] border border-[#D8E4D8] text-[#2D6A4F] text-[11px] font-semibold">
                            <Wrench className="w-3 h-3 text-[#2D6A4F]" />
                            {msg.agentToolTag}
                          </span>
                        </div>
                      )}

                      {/* Recommended Crop Info Card */}
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

            {/* In-Flight Agent Thinking indicator */}
            {isProcessing && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 text-sm">
                  🌾
                </div>
                <div className="bg-white border border-[#D8E4D8] rounded-2xl rounded-tl-none p-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#2D6A4F]">
                    <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-ping" />
                    <span>Routing through Triage Agent & Specialist Tools...</span>
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
                placeholder="Apni farming problem yahan likhein..."
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
                    Farmer context loaded ({farmer.location})
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
                    Classified intent & guardrails check
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
                    Domain specialist activated
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

          {/* Educational Note for Presentation */}
          <div className="mt-5 p-3 rounded-xl bg-[#F0F4F0] border border-[#D8E4D8] text-[11px] text-[#4A5D4A] space-y-1">
            <p className="font-semibold text-[#1B4332] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
              Architecture Flow:
            </p>
            <p className="font-mono text-[10px] text-[#2D6A4F]">
              Farmer → Kisan Dost → Triage Agent → Specialist Agent → Tool → Response
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
