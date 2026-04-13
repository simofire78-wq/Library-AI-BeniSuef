import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { BookEventButton } from '@/components/BookEventButton';

const TYPE_COLORS: Record<string, string> = {
  'ندوة علمية': 'bg-primary/10 text-primary border-primary/30',
  'ورشة عمل': 'bg-green-500/10 text-green-700 border-green-500/30',
  'مناقشة علمية': 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  'مؤتمر': 'bg-orange-500/10 text-orange-700 border-orange-500/30',
  'رحلة علمية': 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  'احتفالية': 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
};

export default function Events() {
  const { data: events, isLoading } = useAnnouncements('event');

  const upcoming = (events ?? []).filter((e) => e.is_upcoming);
  const past = (events ?? []).filter((e) => !e.is_upcoming);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-bl from-primary/15 via-primary/5 to-background border border-primary/20 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">الفعاليات والأنشطة</h1>
            <p className="text-sm text-muted-foreground">الندوات والمؤتمرات وورش العمل والأنشطة الأكاديمية</p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          يحرص قسم علوم المعلومات على تنظيم فعاليات علمية وثقافية متنوعة طوال العام الدراسي، تتيح للطلاب والباحثين الاطلاع على أحدث المستجدات في مجال المكتبات والمعلومات.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {/* Upcoming Events */}
      {!isLoading && upcoming.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
            <h2 className="text-lg font-semibold">الفعاليات القادمة</h2>
          </div>
          <div className="space-y-4">
            {upcoming.map((event) => {
              const remaining = event.capacity != null
                ? event.capacity - (event.registered ?? 0)
                : null;

              return (
                <div key={event.id} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {event.tag && (
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[event.tag] || 'bg-muted text-muted-foreground border-border'}`}>
                            {event.tag}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent border border-border text-accent-foreground px-2.5 py-0.5 text-xs font-medium">
                          قادم
                        </span>
                      </div>
                      <h3 className="font-bold text-base mb-2 leading-snug">{event.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{event.description}</p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {new Date(event.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        {event.event_time && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {event.event_time}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      {event.capacity != null && (
                        <BookEventButton
                          announcementId={event.id}
                          capacity={event.capacity}
                          registered={event.registered}
                        />
                      )}
                    </div>

                    {event.capacity != null && (
                      <div className="rounded-xl border border-border bg-accent/30 p-4 text-center min-w-[120px] shrink-0">
                        <p className="text-xs text-muted-foreground mb-1">المسجلون</p>
                        <p className="text-2xl font-bold text-primary">{event.registered ?? 0}</p>
                        <p className="text-xs text-muted-foreground">/ {event.capacity} مقعد</p>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${Math.min(((event.registered ?? 0) / event.capacity) * 100, 100)}%` }}
                          />
                        </div>
                        {remaining !== null && (
                          <p className={`text-xs mt-1 font-medium ${remaining <= 0 ? 'text-destructive' : 'text-chart-2'}`}>
                            {remaining <= 0 ? 'مكتمل' : `${remaining} متبقي`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Events */}
      {!isLoading && past.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-6">الفعاليات السابقة</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {past.map((event) => (
              <div key={event.id} className="rounded-2xl border border-border bg-card p-5 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {event.tag && (
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[event.tag] || 'bg-muted text-muted-foreground border-border'}`}>
                      {event.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-2 leading-snug">{event.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{event.description}</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(event.date).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  {event.registered != null && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {event.registered} حضور
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && upcoming.length === 0 && past.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>لا توجد فعاليات حالياً</p>
        </div>
      )}

    </div>
  );
}
