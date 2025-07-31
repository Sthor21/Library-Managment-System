import { useState } from 'react';
import { Star, Heart, BookOpen, User, Calendar } from 'lucide-react';

// Import book cover images
import digitalRevolutionCover from '../assets/book-covers/digital-revolution.jpg';
import modernArtCover from '../assets/book-covers/modern-art.jpg';
import climateSolutionsCover from '../assets/book-covers/climate-solutions.jpg';
import ancientCivilizationsCover from '../assets/book-covers/ancient-civilizations.jpg';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  rating: number;
  available: boolean;
  publishYear: number;
  coverImage?: string;
  coverColor: string;
  isbn: string;
}

const BookCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = [
    'all',
    'Fiction',
    'Non-Fiction',
    'Science',
    'History',
    'Technology',
    'Art',
    'Biography'
  ];

  const books: Book[] = [
    {
      id: 1,
      title: "The Digital Revolution",
      author: "Sarah Johnson",
      category: "Technology",
      rating: 4.8,
      available: true,
      publishYear: 2023,
      coverImage: digitalRevolutionCover,
      coverColor: "from-blue-400 to-blue-600",
      isbn: "978-0-123456-78-9"
    },
    {
      id: 2,
      title: "Modern Art Movements",
      author: "Robert Chen",
      category: "Art",
      rating: 4.6,
      available: false,
      publishYear: 2022,
      coverImage: modernArtCover,
      coverColor: "from-purple-400 to-purple-600",
      isbn: "978-0-987654-32-1"
    },
    {
      id: 3,
      title: "Climate Change Solutions",
      author: "Dr. Maria Garcia",
      category: "Science",
      rating: 4.9,
      available: true,
      publishYear: 2024,
      coverImage: climateSolutionsCover,
      coverColor: "from-green-400 to-green-600",
      isbn: "978-0-456789-12-3"
    },
    {
      id: 4,
      title: "Ancient Civilizations",
      author: "Professor William Lee",
      category: "History",
      rating: 4.7,
      available: true,
      publishYear: 2023,
      coverImage: ancientCivilizationsCover,
      coverColor: "from-amber-400 to-amber-600",
      isbn: "978-0-234567-89-0"
    },
    {
      id: 5,
      title: "The Future of AI",
      author: "Alex Thompson",
      category: "Technology",
      rating: 4.5,
      available: true,
      publishYear: 2024,
      coverColor: "from-indigo-400 to-indigo-600",
      isbn: "978-0-345678-90-1"
    },
    {
      id: 6,
      title: "Psychology Today",
      author: "Dr. Emily Watson",
      category: "Non-Fiction",
      rating: 4.4,
      available: false,
      publishYear: 2023,
      coverColor: "from-pink-400 to-pink-600",
      isbn: "978-0-567890-12-4"
    }
  ];

  const filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  const toggleFavorite = (bookId: number) => {
    setFavorites(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-foreground mb-4">
            Book Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our extensive collection of books across various categories
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-pill ${
                selectedCategory === category ? 'active' : ''
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map((book, index) => (
            <div
              key={book.id}
              className="book-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Book Cover */}
              <div className="book-cover relative overflow-hidden">
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${book.coverColor} flex items-center justify-center`}>
                    <BookOpen className="w-12 h-12 text-white/80" />
                  </div>
                )}
                
                {/* Availability Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  book.available 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {book.available ? 'Available' : 'Borrowed'}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(book.id)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      favorites.includes(book.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-white'
                    }`} 
                  />
                </button>
              </div>

              {/* Book Info */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-sm text-primary font-medium">
                    {book.category}
                  </span>
                </div>
                
                <h3 className="font-playfair text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                
                <div className="flex items-center text-muted-foreground text-sm mb-3">
                  <User className="w-4 h-4 mr-1" />
                  <span>{book.author}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{book.publishYear}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{book.rating}</span>
                  </div>
                </div>

                <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  book.available
                    ? 'btn-primary'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}>
                  {book.available ? 'Borrow Book' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="btn-secondary">
            Load More Books
          </button>
        </div>
      </div>
    </section>
  );
};

export default BookCatalog;