import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Heart, 
  Flame, 
  ShoppingBag, 
  HelpCircle, 
  Check, 
  RefreshCw,
  ChefHat
} from 'lucide-react';
import { imgChefOwner } from '../data/mockData';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  time: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMenu?: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMenu,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: 'Salam mesra dan selamat datang! Saya Kak Zamziah AI dari Dapur Burger & Popia Simpul. 😊\n\nBuntu nak pilih burger mana yang paling juicy, atau balang popia mana yang sesuai untuk minum petang sekeluarga? Tanya saja saya, saya sedia bantu cadangkan!',
      time: 'Baru sahaja',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Cadangan set untuk 4-5 orang makan',
    'Popia mana yang kanak-kanak paling suka?',
    'Menu burger yang pedas & padu',
    'Berapa lama popia simpul boleh tahan?',
    'Ada promosi atau kod kupon diskaun?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: messageContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Map previous messages for context
      const history = messages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error(`API status ${res.status}`);
      }

      const data = await res.json();

      if (data.reply) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Tiada jawapan dari AI');
      }
    } catch (err: any) {
      console.warn('Chat API notice (using responsive local menu assistant):', err);
      
      // Intelligent local assistant fallback for static hosting (e.g. GitHub Pages)
      let localReply = 'Terima kasih atas pertanyaan anda! Di Dapur Bonda, semua patty burger daging & ayam dan popia simpul kasih dibuat segar setiap hari tanpa bahan pengawet. Ada apa-apa menu spesifik yang anda cari?';
      const lower = messageContent.toLowerCase();

      if (lower.includes('orang') || lower.includes('ramai') || lower.includes('pax') || lower.includes('jamuan')) {
        localReply = 'Untuk jamuan 4-6 orang, Kak sarankan ambil 1 Set Kombo Minum Petang Kasih (RM 22) bersama 1 Balang Mega Popia Simpul (650g - RM 38)! Jimat, meriah dan boleh kongsi makan panas-panas.';
      } else if (lower.includes('budak') || lower.includes('kanak') || lower.includes('pedas') || lower.includes('tak pedas')) {
        localReply = 'Untuk kanak-kanak atau yang kurang makan pedas, Popia Simpul Original dan Golden Cheese adalah pilihan no.1! Rasanya manis berlemak ikan segar. Untuk burger, Burger Ayam Crispy Buttermilk memang lembut dan sedap.';
      } else if (lower.includes('tahan') || lower.includes('simpan') || lower.includes('expired') || lower.includes('tarikh')) {
        localReply = 'Popia Simpul Kasih kami tahan sehingga 2-3 bulan jika disimpan dalam balang bertutup rapat pada suhu bilik. Jangan simpan tempat lembap supaya kekal rangup krup-krup!';
      } else if (lower.includes('kupon') || lower.includes('diskaun') || lower.includes('promo') || lower.includes('kod')) {
        localReply = 'Ada! Masukkan kod "KASIH5" dalam troli untuk jimat RM5 (minima belanja RM25), atau kod "SEDAP10" untuk diskaun 10%! Penghantaran juga PERCUMA untuk pesanan RM40 ke atas.';
      } else if (lower.includes('burger') || lower.includes('daging') || lower.includes('ayam')) {
        localReply = 'Burger paling laris kami ialah "Burger Daging Special Homemade" (RM 11.50) dengan limpahan sos lada hitam dan telur banji, serta "Burger Ayam Crispy Buttermilk" (RM 10.90) yang rangup garing!';
      }

      const fallbackMsg: ChatMessage = {
        id: `local-${Date.now()}`,
        role: 'assistant',
        text: localReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full h-[620px] max-h-[90vh] shadow-2xl border border-rose-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={imgChefOwner}
                alt="Kak Zamziah AI"
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-rose-700 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-base leading-tight">
                  Kak Zamziah AI
                </h3>
                <span className="bg-amber-400/90 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  Dapur AI
                </span>
              </div>
              <p className="text-[11px] text-rose-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Pembantu Cadangan Hidangan Makanan</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/70 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
                  <ChefHat className="w-4 h-4 text-rose-700" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-200/90 rounded-bl-none'
                }`}
              >
                <div className="text-xs sm:text-[13px]">{msg.text}</div>
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    msg.role === 'user' ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Typing loading indicator */}
          {isLoading && (
            <div className="flex gap-2.5 items-center text-stone-500 text-xs">
              <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                <ChefHat className="w-4 h-4 text-rose-700 animate-spin" />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-stone-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-stone-500 ml-1">Kak Zamziah sedang menaip cadangan...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-3 py-2 bg-white border-t border-stone-100 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
          {quickPrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-800 text-[11px] text-stone-700 font-medium whitespace-nowrap transition-colors cursor-pointer border border-stone-200/60 shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Tanya pasal burger, popia, bajet, atau tempahan..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-100 rounded-xl outline-none border border-transparent focus:border-rose-400 focus:bg-white transition-all"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
            aria-label="Hantar mesej"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
