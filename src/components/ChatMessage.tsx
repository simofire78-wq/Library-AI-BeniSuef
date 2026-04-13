import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-muted text-foreground rounded-tl-sm'
        )}
      >
        {isUser ? (
          <span>{content}</span>
        ) : (
          <div
            className={cn(
              'prose prose-sm max-w-none',
              'prose-headings:font-bold prose-headings:text-foreground',
              'prose-h1:text-base prose-h2:text-sm prose-h3:text-sm',
              'prose-p:text-foreground prose-p:my-1 prose-p:leading-relaxed',
              'prose-strong:text-foreground prose-strong:font-semibold',
              'prose-ul:my-1.5 prose-ul:pr-4 prose-ul:list-disc',
              'prose-ol:my-1.5 prose-ol:pr-4 prose-ol:list-decimal',
              'prose-li:my-0.5 prose-li:text-foreground',
              'prose-blockquote:border-r-2 prose-blockquote:border-primary prose-blockquote:pr-3 prose-blockquote:my-2 prose-blockquote:text-muted-foreground',
              'prose-code:bg-background prose-code:rounded prose-code:px-1 prose-code:text-xs prose-code:text-foreground',
              'prose-hr:border-border',
              '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0'
            )}
            dir="rtl"
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
}
