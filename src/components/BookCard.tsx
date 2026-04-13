import { Link } from 'react-router-dom';
import { Star, Eye, Download, Calendar, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { BookWithUsage } from '@/lib/types';
import { getBookUsage } from '@/lib/types';

interface BookCardProps {
  book: BookWithUsage;
}

const CATEGORY_COLORS: Record<string, string> = {
  'الأرشيف والتوثيق': 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  'علوم المعلومات والمكتبات': 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  'تقنيات المعلومات': 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  'إدارة المعرفة': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  'الخدمات المكتبية': 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
  'استرجاع المعلومات': 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  'النشر والإتاحة': 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
  'إدارة الجودة': 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
  'التحول الرقمي': 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
  'القياس العلمي': 'bg-teal-500/15 text-teal-700 dark:text-teal-300',
  'الفهرسة والتصنيف': 'bg-lime-500/15 text-lime-700 dark:text-lime-300',
  'محو الأمية المعلوماتية': 'bg-pink-500/15 text-pink-700 dark:text-pink-300',
  'التواصل الاجتماعي': 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
};

export function BookCard({ book }: BookCardProps) {
  const usage = getBookUsage(book);
  const categoryStyle = CATEGORY_COLORS[book.category] || 'bg-muted text-muted-foreground';

  return (
    <Link to={`/book/${book.id}`}>
      <Card className="group h-full hover:shadow-md transition-all duration-200 hover:border-primary/40 cursor-pointer overflow-hidden">
        {/* Cover image */}
        {book.cover_url && (
          <div className="h-32 w-full overflow-hidden">
            <img
              src={book.cover_url}
              alt={book.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        {!book.cover_url && (
          <div className="h-20 w-full bg-gradient-to-bl from-primary/10 to-primary/5 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-primary/30" />
          </div>
        )}
        <CardHeader className="pb-2 pt-3">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground">{book.author}</p>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className={`text-xs ${categoryStyle}`}>
              {book.category}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="pt-2 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground w-full">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {book.year}
            </span>
            {usage && (
              <>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {usage.views.toLocaleString()}
                </span>
                {usage.rating != null && usage.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {usage.rating.toFixed(1)}
                  </span>
                )}
                <span className="flex items-center gap-1 ml-auto">
                  <Download className="h-3 w-3" />
                  {usage.downloads.toLocaleString()}
                </span>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
