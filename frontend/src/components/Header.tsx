import { useState } from 'react';
import { Search, Book, Users, Settings, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '#', icon: Book, active: true },
    { name: 'Browse Books', href: '#', icon: Book },
    { name: 'Members', href: '#', icon: Users },
    { name: 'Settings', href: '#', icon: Settings },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-playfair text-xl font-bold text-foreground">
                LibraryHub
              </h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`nav-link flex items-center space-x-2 ${
                  item.active ? 'active' : ''
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search books, authors..."
                className="pl-10 pr-4 py-2 w-64 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/60 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`nav-link flex items-center space-x-2 ${
                    item.active ? 'active' : ''
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>
            {/* Mobile Search */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search books, authors..."
                className="pl-10 pr-4 py-2 w-full bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;