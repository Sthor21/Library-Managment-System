import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Plus, Star, Heart, BookOpen, User, Calendar, Grid, List, Edit, Trash } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

// --- API Integration ---
import { BookService } from '../services/BookService';
import { BookResponseDTO, BookRequestDto } from '../dto/dto';

// --- Placeholder Images ---
// You can replace this with actual imports for your book covers
// import placeholderCover1 from '../assets/book-covers/placeholder1.jpg';
const placeholderCoverImage = "https://placehold.co/600x800/6366f1/ffffff?text=Book";

// This interface is for the component's internal state, adapted from the API response
interface Book {
    id: number;
    title: string;
    author: string;
    category: string; // Mapped from 'genres'
    rating: number; // Default value since it's not in the DTO
    available: boolean; // Derived from availableCopies
    publishYear: number; // Mapped from 'publishedDate'
    coverImage?: string; // Placeholder or actual image
    coverColor: string; // For fallback UI
    isbn: string;
    description: string;
    totalCopies: number;
    availableCopies: number;
}

// Helper function to map API data to the component's Book interface
const mapDtoToBook = (dto: BookResponseDTO): Book => {
    const colors = ["from-blue-500 to-blue-700", "from-purple-500 to-purple-700", "from-green-500 to-green-700", "from-amber-500 to-amber-700", "from-red-500 to-red-700"];
    return {
        id: dto.id,
        title: dto.title,
        author: dto.author,
        category: dto.genres.split(',')[0] || 'General', // Use the first genre as category
        rating: 4.5, // Default rating
        available: dto.availableCopies > 0,
        publishYear: new Date(dto.publishedDate).getFullYear(),
        coverImage: placeholderCoverImage, // Use placeholder
        coverColor: colors[dto.id % colors.length], // Assign a fallback color
        isbn: dto.isbn,
        description: dto.description,
        totalCopies: dto.totalCopies,
        availableCopies: dto.availableCopies,
    };
};

const Books = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [favorites, setFavorites] = useState<number[]>([]);

    // State for managing dialogs
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    const { toast } = useToast();

    const categories = useMemo(() => {
        const allCats = books.map(b => b.category);
        return ['all', ...Array.from(new Set(allCats))];
    }, [books]);

    // --- Data Fetching Logic ---
    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            let bookDtos: BookResponseDTO[];
            if (searchTerm.trim()) {
                bookDtos = await BookService.searchBooks(searchTerm);
            } else {
                // As requested, getAllBooks fetches the first 10
                bookDtos = await BookService.getAllBooks();
            }
            setBooks(bookDtos.map(mapDtoToBook));
        } catch (error) {
            toast({ title: "Error", description: "Failed to load books.", variant: "destructive" });
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, toast]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            return selectedCategory === 'all' || book.category === selectedCategory;
        });
    }, [books, selectedCategory]);

    // --- CRUD Handlers ---
    const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newBookData: BookRequestDto = {
            title: formData.get('title') as string,
            author: formData.get('author') as string,
            description: formData.get('description') as string,
            publisher: formData.get('publisher') as string,
            pageCount: Number(formData.get('pageCount')),
            genres: formData.get('genres') as string,
            isbn: formData.get('isbn') as string,
            language: formData.get('language') as string,
            publishedDate: formData.get('publishedDate') as string,
            totalCopies: Number(formData.get('totalCopies')),
        };

        try {
            await BookService.addBook(newBookData);
            toast({ title: "Success", description: "Book added successfully." });
            setIsAddDialogOpen(false);
            fetchBooks(); // Refresh list
        } catch (error) {
            toast({ title: "Error", description: "Failed to add book.", variant: "destructive" });
        }
    };
    
    const handleUpdateBook = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingBook) return;

        const formData = new FormData(e.currentTarget);
        const updatedData: BookRequestDto = {
             title: formData.get('title') as string,
            author: formData.get('author') as string,
            description: formData.get('description') as string,
            publisher: formData.get('publisher') as string,
            pageCount: Number(formData.get('pageCount')),
            genres: formData.get('genres') as string,
            isbn: formData.get('isbn') as string,
            language: formData.get('language') as string,
            publishedDate: formData.get('publishedDate') as string,
            totalCopies: Number(formData.get('totalCopies')),
        };

        try {
            await BookService.updateBook(editingBook.id, updatedData);
            toast({ title: "Success", description: "Book updated successfully." });
            setIsEditDialogOpen(false);
            fetchBooks(); // Refresh list
        } catch (error) {
            toast({ title: "Error", description: "Failed to update book.", variant: "destructive" });
        }
    };

    const handleDeleteBook = async (bookId: number) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await BookService.deleteBook(bookId);
            toast({ title: "Success", description: "Book has been deleted." });
            fetchBooks(); // Refresh list
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete book.", variant: "destructive" });
        }
    };
    
    const openEditDialog = (book: Book) => {
        setEditingBook(book);
        setIsEditDialogOpen(true);
    };

    const toggleFavorite = (bookId: number) => {
        setFavorites(prev =>
            prev.includes(bookId)
                ? prev.filter(id => id !== bookId)
                : [...prev, bookId]
        );
    };

    const renderBookCard = (book: Book) => (
        <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                <img
                    src={book.coverImage}
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/600x800/94a3b8/ffffff?text=${book.title.split(' ').map(w=>w[0]).join('')}`}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-3 right-3">
                    <Badge variant={book.available ? 'default' : 'destructive'} className="text-xs">{book.available ? 'Available' : 'Borrowed'}</Badge>
                </div>
                <Button variant="ghost" size="icon" className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm hover:bg-white/30" onClick={() => toggleFavorite(book.id)}>
                    <Heart className={`w-4 h-4 ${favorites.includes(book.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 p-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    <Button size="sm" className="flex-1">{book.available ? 'Borrow' : 'Reserve'}</Button>
                    <Button variant="secondary" size="icon" onClick={() => openEditDialog(book)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteBook(book.id)}><Trash className="w-4 h-4" /></Button>
                </div>
            </div>
            <CardContent className="p-4 flex-grow flex flex-col">
                <Badge variant="outline" className="text-xs mb-2 self-start">{book.category}</Badge>
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2 flex-grow">{book.title}</h3>
                <div className="flex items-center text-muted-foreground text-sm mb-2"><User className="w-3 h-3 mr-1" /><span className="truncate">{book.author}</span></div>
                <div className="flex items-center justify-between text-sm mt-auto">
                    <div className="flex items-center space-x-2"><Calendar className="w-3 h-3 text-muted-foreground" /><span>{book.publishYear}</span></div>
                    <div className="flex items-center space-x-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span>{book.rating}</span></div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{book.availableCopies} of {book.totalCopies} available</div>
            </CardContent>
        </Card>
    );

    // --- Render ---
    return (
        <div className="p-6 space-y-6">
            {/* Header and Add Book Dialog */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Book Collection</h1>
                    <p className="text-muted-foreground mt-1">Manage your library's book inventory</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Book</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader><DialogTitle>Add New Book</DialogTitle></DialogHeader>
                        <form onSubmit={handleAddBook} className="space-y-4 pt-4">
                            {/* Add Book Form Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
                                <div><Label htmlFor="author">Author</Label><Input id="author" name="author" required /></div>
                                <div><Label htmlFor="isbn">ISBN</Label><Input id="isbn" name="isbn" required /></div>
                                <div><Label htmlFor="genres">Genres (comma-separated)</Label><Input id="genres" name="genres" required /></div>
                                <div><Label htmlFor="publisher">Publisher</Label><Input id="publisher" name="publisher" required /></div>
                                <div><Label htmlFor="language">Language</Label><Input id="language" name="language" required /></div>
                                <div><Label htmlFor="pageCount">Page Count</Label><Input id="pageCount" name="pageCount" type="number" required /></div>
                                <div><Label htmlFor="totalCopies">Total Copies</Label><Input id="totalCopies" name="totalCopies" type="number" required /></div>
                                <div className="col-span-2"><Label htmlFor="publishedDate">Published Date</Label><Input id="publishedDate" name="publishedDate" type="date" required /></div>
                                <div className="col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={4} /></div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                <Button type="submit">Add Book</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="text" placeholder="Search by title, author, or ISBN..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (<SelectItem key={category} value={category}>{category === 'all' ? 'All Categories' : category}</SelectItem>))}
                    </SelectContent>
                </Select>
                <div className="flex border rounded-lg bg-background p-1">
                    <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><Grid className="w-4 h-4" /></Button>
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
                </div>
            </div>

            {/* Books Display */}
            {loading ? <p className="text-center text-muted-foreground py-8">Loading books...</p> :
                filteredBooks.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filteredBooks.map(renderBookCard)}</div>
                    ) : (
                        <div className="space-y-4">{/* ListView would go here */}</div>
                    )
                ) : <p className="text-center text-muted-foreground py-8">No books found. Try adjusting your search.</p>
            }

            {/* Edit Book Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                 <DialogContent className="sm:max-w-2xl">
                        <DialogHeader><DialogTitle>Edit Book</DialogTitle></DialogHeader>
                        {editingBook && (
                             <form onSubmit={handleUpdateBook} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label htmlFor="edit-title">Title</Label><Input id="edit-title" name="title" required defaultValue={editingBook.title} /></div>
                                    <div><Label htmlFor="edit-author">Author</Label><Input id="edit-author" name="author" required defaultValue={editingBook.author} /></div>
                                    <div><Label htmlFor="edit-isbn">ISBN</Label><Input id="edit-isbn" name="isbn" required defaultValue={editingBook.isbn} /></div>
                                    <div><Label htmlFor="edit-genres">Genres</Label><Input id="edit-genres" name="genres" required defaultValue={editingBook.category} /></div>
                                    <div><Label htmlFor="edit-publisher">Publisher</Label><Input id="edit-publisher" name="publisher" required /></div>
                                    <div><Label htmlFor="edit-language">Language</Label><Input id="edit-language" name="language" required /></div>
                                    <div><Label htmlFor="edit-pageCount">Page Count</Label><Input id="edit-pageCount" name="pageCount" type="number" required defaultValue={0}/></div>
                                    <div><Label htmlFor="edit-totalCopies">Total Copies</Label><Input id="edit-totalCopies" name="totalCopies" type="number" required defaultValue={editingBook.totalCopies} /></div>
                                    <div className="col-span-2"><Label htmlFor="edit-publishedDate">Published Date</Label><Input id="edit-publishedDate" name="publishedDate" type="date" required defaultValue={new Date(editingBook.publishYear, 0, 1).toISOString().split('T')[0]} /></div>
                                    <div className="col-span-2"><Label htmlFor="edit-description">Description</Label><Textarea id="edit-description" name="description" rows={4} defaultValue={editingBook.description} /></div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                    <Button type="submit">Save Changes</Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
            </Dialog>
        </div>
    );
};

export default Books;
