import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/components/ChatMessage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Message = { role: 'user' | 'assistant'; content: string };

const SUGGESTED = [
  'أوصني بكتب عن الذكاء الاصطناعي',
  'ما هي أحدث رسائل علم المعلومات؟',
  'كتب عن علم البيانات نُشرت حديثاً',
  'كيف أبحث في المكتبة الرقمية؟'
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'مرحباً بك في مكتبة قسم علوم المعلومات! أنا مساعدك الذكي، كيف يمكنني مساعدتك في البحث اليوم؟'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('smooth-endpoint', {
        body: { messages: [...messages, userMsg].slice(-10) },
      });

      if (error) throw error;

      if (data?.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (e: any) {
      console.error("Chat Error:", e);
      toast({
        title: "عذراً، حدث خطأ في الاتصال",
        description: "يبدو أن حصة الذكاء الاصطناعي المجانية انتهت مؤقتاً. حاول مرة أخرى بعد قليل.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setMessages([{ role: 'assistant', content: 'تم بدء محادثة جديدة. كيف يمكنني مساعدتك؟' }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto border rounded-lg bg-background shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-bold text-sm">مساعد مكتبة القسم</h1>
            <p className="text-xs text-muted-foreground">متصل بالكتالوج الرقمي للقسم</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <div className="text-xs text-muted-foreground animate-pulse">جاري التفكير...</div>}
        <div ref={bottomRef} />
      </div>

      {/* Footer & Input */}
      <div className="p-4 border-t bg-muted/10">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTED.map(s => (
              <button 
                key={s} 
                onClick={() => send(s)}
                className="text-xs bg-background border px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3 text-yellow-500" /> {s}
              </button>
            ))}
          </div>
        )}
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <Input 
            placeholder="اكتب سؤالك هنا..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}