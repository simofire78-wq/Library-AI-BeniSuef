import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { useStats, useBooks } from '@/hooks/useBooks';
import { BookOpen, Eye, Download, Star, BarChart3, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(221, 70%, 60%)',
  'hsl(142, 70%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(350, 80%, 60%)',
  'hsl(271, 70%, 60%)',
  'hsl(180, 60%, 45%)',
  'hsl(30, 80%, 55%)',
  'hsl(200, 70%, 50%)',
];

const ACTIVITY_LABELS: Record<string, string> = {
  view: 'عرض PDF',
  download: 'تحميل PDF',
  rating: 'التقييمات',
};

// Smart content-type classifier
function classifyBook(b: { title: string; description?: string | null; keywords?: string[] | null; category?: string }): string {
  const combined = `${b.title} ${b.description || ''} ${(b.keywords || []).join(' ')} ${b.category}`.toLowerCase();
  if (combined.includes('دكتوراه') || combined.includes('دكتورا') || combined.includes('phd') || combined.includes('doctor')) return 'رسائل دكتوراه';
  if (combined.includes('ماجستير') || combined.includes('ماستر') || combined.includes('master')) return 'رسائل ماجستير';
  if (combined.includes('دورية') || combined.includes('مجلة') || combined.includes('journal') || combined.includes('periodical')) return 'دوريات';
  return 'كتب';
}

type PieFilterMode = 'contentType' | 'category' | 'language';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: books, isLoading: booksLoading } = useBooks();
  const [pieFilter, setPieFilter] = useState<PieFilterMode>('contentType');

  const categoryData = stats
    ? Object.entries(stats.categoryCount).map(([name, count]) => ({ name, count }))
    : [];

  const yearData = stats
    ? Object.entries(stats.yearCount)
        .map(([year, count]) => ({ year: parseInt(year), count }))
        .sort((a, b) => a.year - b.year)
    : [];

  const activityTypeData = stats
    ? stats.activityTypeTotals.map((item) => ({
        name: ACTIVITY_LABELS[item.activity_type] || item.activity_type,
        total: item.total,
      }))
    : [];

  const activityDailyData = stats
    ? stats.activityDaily.map((item) => ({
        day: new Date(item.day).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
        views: item.views,
        downloads: item.downloads,
        ratings: item.ratings,
      }))
    : [];

  // Dynamic pie chart data based on filter
  const pieData = (() => {
    if (!books) return [];
    const counts: Record<string, number> = {};
    books.forEach((b) => {
      let key: string;
      switch (pieFilter) {
        case 'contentType':
          key = classifyBook(b);
          break;
        case 'category':
          key = b.category || 'غير مصنف';
          break;
        case 'language':
          key = b.language || 'غير محدد';
          break;
      }
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  })();

  const pieFilterLabels: Record<PieFilterMode, string> = {
    contentType: 'نوع الوعاء',
    category: 'التصنيف',
    language: 'اللغة',
  };

  const isLoading = statsLoading || booksLoading;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-bl from-primary/15 via-primary/5 to-background border border-primary/20 p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">لوحة التحليلات</h1>
            <p className="text-sm text-muted-foreground">رؤى وتصورات بيانية من مجموعة المكتبة</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="إجمالي المقتنيات" value={stats.totalBooks.toLocaleString('ar-EG')} icon={BookOpen} description="في المجموعة" />
          <StatCard title="إجمالي المشاهدات" value={stats.totalViews.toLocaleString('ar-EG')} icon={Eye} description="عبر جميع المقتنيات" />
          <StatCard title="التحميلات" value={stats.totalDownloads.toLocaleString('ar-EG')} icon={Download} description="إجمالي التحميلات" />
          <StatCard title="متوسط التقييم" value={`${stats.avgRating} / 5`} icon={Star} description="تقييم المجتمع" />
        </div>
      ) : null}

      {/* Charts */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">المقتنيات حسب الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--popover-foreground))', fontSize: 12 }}
                    formatter={(v) => [v, 'العدد']}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart with filter */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  توزيع المقتنيات
                </CardTitle>
                <div className="flex gap-1">
                  {(Object.keys(pieFilterLabels) as PieFilterMode[]).map((mode) => (
                    <Button
                      key={mode}
                      variant={pieFilter === mode ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => setPieFilter(mode)}
                    >
                      {pieFilterLabels[mode]}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" outerRadius={85} dataKey="count" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={true} fontSize={11}>
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--popover-foreground))', fontSize: 12 }}
                    formatter={(v, n) => [v, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">الإصدارات حسب السنة</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={yearData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--popover-foreground))', fontSize: 12 }}
                    formatter={(v) => [v, 'العدد']}
                  />
                  <Line type="monotone" dataKey="count" stroke="hsl(142, 70%, 45%)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(142, 70%, 45%)' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">توزيع أنواع النشاط</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={activityTypeData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--popover-foreground))', fontSize: 12 }}
                    formatter={(v) => [v, 'عدد النشاطات']}
                  />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {activityTypeData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">النشاط خلال آخر 30 يوم</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityDailyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--popover-foreground))', fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="views" name="المشاهدات" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="downloads" name="التحميلات" stroke="hsl(142, 70%, 45%)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="ratings" name="التقييمات" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
