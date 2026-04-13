import { useState } from 'react';
import { Home, Search, BarChart3, MessageSquare, Menu, X, Info, GraduationCap, Newspaper, Phone, ChevronDown, LogIn, User } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation, Link } from 'react-router-dom';
import departmentLogo from '@/assets/department-logo.jpg';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const PRIMARY_NAV = [
  { title: 'الرئيسية', url: '/', icon: Home },
  { title: 'البحث', url: '/search', icon: Search },
  { title: 'لوحة التحليلات', url: '/dashboard', icon: BarChart3 },
  { title: 'المساعد الذكي', url: '/chatbot', icon: MessageSquare },
];

const SECONDARY_NAV = [
  { title: 'عن المكتبة', url: '/about', icon: Info },
  { title: 'الخدمات', url: '/services', icon: GraduationCap },
  { title: 'الأخبار والفعاليات', url: '/announcements', icon: Newspaper },
  { title: 'تواصل معنا', url: '/contact', icon: Phone },
];

export function TopNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const isSecondaryActive = SECONDARY_NAV.some((item) =>
    item.url === '/' ? location.pathname === '/' : location.pathname.startsWith(item.url)
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-primary shadow-md" dir="rtl">
      {/* Top bar: university branding */}
      <div className="border-b border-primary-foreground/20 py-1 px-4 text-center bg-primary/90">
        <p className="text-xs text-primary-foreground/80 font-medium">
          جامعة بني سويف — كلية الآداب — قسم علوم المعلومات
        </p>
      </div>

      {/* Main navbar */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={departmentLogo}
            alt="شعار القسم"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-foreground/40 shadow"
          />
          <div className="leading-tight">
            <p className="text-base font-bold text-primary-foreground">مكتبة قسم علوم المعلومات</p>
            <p className="text-xs text-primary-foreground/70">جامعة بني سويف</p>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === '/'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
              activeClassName="bg-primary-foreground/20 text-primary-foreground font-bold"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          ))}

          {/* Dropdown for secondary pages */}
          <div className="relative">
            <button
              onClick={() => setSecondaryOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isSecondaryActive
                  ? 'bg-primary-foreground/20 text-primary-foreground font-bold'
                  : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground'
              }`}
            >
              <span>القسم</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${secondaryOpen ? 'rotate-180' : ''}`} />
            </button>

            {secondaryOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 rounded-xl border border-border bg-card shadow-lg z-50 py-1 overflow-hidden">
                {SECONDARY_NAV.map((item) => (
                  <NavLink
                    key={item.url}
                    to={item.url}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    activeClassName="bg-primary/10 text-primary font-semibold"
                    onClick={() => setSecondaryOpen(false)}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.title}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Auth button */}
          {!authLoading && (
            <div className="hidden md:flex">
              {user ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>حسابي</span>
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>تسجيل الدخول</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="فتح القائمة"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/20 px-4 pb-3">
          <ul className="flex flex-col gap-1 pt-2">
            {[...PRIMARY_NAV, ...SECONDARY_NAV].map((item) => (
              <li key={item.url}>
                <NavLink
                  to={item.url}
                  end={item.url === '/'}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors w-full"
                  activeClassName="bg-primary-foreground/20 text-primary-foreground font-bold"
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              </li>
            ))}
            {/* Auth link in mobile */}
            <li>
              <Link
                to={user ? '/profile' : '/auth'}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors w-full"
                onClick={() => setMobileOpen(false)}
              >
                {user ? <User className="h-4 w-4 shrink-0" /> : <LogIn className="h-4 w-4 shrink-0" />}
                <span>{user ? 'حسابي' : 'تسجيل الدخول'}</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
