import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Dashboard from '../components/Dashboard';
import BookCatalog from '../components/BookCatalog';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <Dashboard />
        <BookCatalog />
      </main>
      
      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">LH</span>
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold">LibraryHub</h3>
                  <p className="text-sm opacity-70">Management System</p>
                </div>
              </div>
              <p className="text-sm opacity-70 max-w-md">
                Streamline your library operations with our comprehensive management system. 
                Track books, manage members, and create exceptional reading experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Dashboard</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Browse Books</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Members</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Reports</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Help Center</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Documentation</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Contact Us</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm opacity-70">
            <p>&copy; 2024 LibraryHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;