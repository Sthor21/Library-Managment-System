import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search, Book, Users, ArrowLeftRight, FileText, Settings,
  Menu, X, Bell, User
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FileText },
    { name: 'Books', href: '/books', icon: Book },
    { name: 'Members', href: '/members', icon: Users },
    { name: 'Borrowing', href: '/borrowing', icon: ArrowLeftRight },
    { name: 'Ask Gemini', href: '/Gemini', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 z-40 h-16 w-full bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-playfair text-xl font-bold text-foreground">LibraryHub</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search books, members, ISBN..."
              className="pl-10 bg-muted/50 border-border focus:ring-primary/20"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-xs">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Body Layout */}
      <div className="flex pt-16 h-[calc(100vh-4rem)]">
        {/* Sidebar - Fixed for Laptop */}
        <aside className="w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] bg-card border-r border-border hidden lg:block">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors
                    ${isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar (Drawer style) */}
        {sidebarOpen && (
          <>
            <div className="lg:hidden fixed inset-0 z-20 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <aside className="lg:hidden fixed top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-card border-r border-border overflow-y-auto transition-transform duration-300 ease-in-out">
              <nav className="p-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors
                        ${isActive(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="ml-0 lg:ml-64 flex-1 overflow-y-auto p-6 h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
