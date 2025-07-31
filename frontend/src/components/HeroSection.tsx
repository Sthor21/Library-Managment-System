import { Search, BookOpen, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative hero-gradient py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 border border-white/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="hero-title animate-fade-in">
            Modern Library
            <span className="block text-secondary">Management</span>
          </div>
          
          <p className="hero-subtitle animate-slide-up">
            Streamline your library operations with our comprehensive management system. 
            Track books, manage members, and create an exceptional reading experience.
          </p>

          {/* Search Bar */}
          <div className="search-bar max-w-2xl mx-auto animate-slide-up">
            <Search className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search books, authors, ISBN..."
              className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder-muted-foreground text-lg"
            />
            <button className="btn-primary">
              Search
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in">
            <div className="stat-card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">12,847</div>
              <div className="text-muted-foreground">Books Available</div>
            </div>
            
            <div className="stat-card text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">3,294</div>
              <div className="text-muted-foreground">Active Members</div>
            </div>
            
            <div className="stat-card text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">1,847</div>
              <div className="text-muted-foreground">Books Borrowed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;