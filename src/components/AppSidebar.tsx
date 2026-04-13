import { Home, Search, BarChart3, MessageSquare, BookOpen } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import departmentLogo from '@/assets/department-logo.jpg';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar } from
'@/components/ui/sidebar';

const navItems = [
{ title: 'الرئيسية', url: '/', icon: Home },
{ title: 'البحث', url: '/search', icon: Search },
{ title: 'لوحة التحليلات', url: '/dashboard', icon: BarChart3 },
{ title: 'المساعد الذكي', url: '/chatbot', icon: MessageSquare }];


export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <img
            src={departmentLogo}
            alt="شعار القسم"
            className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-sidebar-primary/50"
          />
          {!collapsed &&
          <div>
              <p className="text-xs font-bold text-sidebar-foreground leading-tight">قسم علوم المعلومات</p>
              <p className="text-xs text-sidebar-foreground/60 leading-tight">جامعة بني سويف</p>
            </div>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>التنقل</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                item.url === '/' ?
                location.pathname === '/' :
                location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end={item.url === '/'}
                        className="flex items-center gap-2">
                        
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>);

              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>);

}
