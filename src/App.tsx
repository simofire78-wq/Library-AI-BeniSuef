import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TopNavbar } from '@/components/TopNavbar';
import { Footer } from '@/components/Footer'; // 1. استيراد الفوتر هنا
import Index from './pages/Index';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import BookDetails from './pages/BookDetails';
import About from './pages/About';
import Services from './pages/Services';
import News from './pages/News';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import SignUp from './pages/SignUp';
import UserAuth from './pages/UserAuth';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col w-full bg-background" dir="rtl">
          <TopNavbar />
          <main className="flex-1"> {/* flex-1 تضمن دفع الفوتر للأسفل */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/news" element={<News />} />
              <Route path="/events" element={<Events />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth" element={<UserAuth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Footer /> {/* 2  */}
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;