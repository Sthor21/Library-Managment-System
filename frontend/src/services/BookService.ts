import axios from 'axios';
import { BookResponseDTO,BookRequestDto } from '@/dto/dto';

// **IMPORTANT**: Adjust this URL to match your backend's address and port.
const API_URL = 'http://localhost:8082/books';

// Create an axios instance with a base URL.
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Fetches all books and returns the first 10 results.
 * Corresponds to: GET /books
 * @returns A promise that resolves to an array of up to 10 books.
 */
const getAllBooks = async (): Promise<BookResponseDTO[]> => {
    const response = await apiClient.get<BookResponseDTO[]>('');
    // As requested, return only the first 10 books from the full list.
    return response.data.slice(0, 10);
};

/**
 * Searches for books based on a keyword.
 * Corresponds to: GET /books/search?keyword={keyword}
 * @param keyword The search term to look for in book titles, authors, etc.
 * @returns A promise that resolves to an array of matching books.
 */
const searchBooks = async (keyword: string): Promise<BookResponseDTO[]> => {
    // If the keyword is empty, it's better to return an empty array
    // than to fetch all books, to avoid unnecessary load.
    if (!keyword.trim()) {
        return [];
    }
    const response = await apiClient.get<BookResponseDTO[]>('/search', {
        params: { keyword }
    });
    return response.data;
};

/**
 * Adds a new book to the library.
 * Corresponds to: POST /books
 * @param bookData The data for the new book.
 * @returns A promise that resolves to the newly created book data.
 */
const addBook = async (bookData: BookRequestDto): Promise<BookResponseDTO> => {
    const response = await apiClient.post<BookResponseDTO>('', bookData);
    return response.data;
};

/**
 * Updates an existing book's information.
 * Corresponds to: PUT /books/{id}
 * @param id The ID of the book to update.
 * @param bookData The new data for the book.
 * @returns A promise that resolves to the updated book data.
 */
const updateBook = async (id: number, bookData: BookRequestDto): Promise<BookResponseDTO> => {
    const response = await apiClient.put<BookResponseDTO>(`/${id}`, bookData);
    return response.data;
};

/**
 * Deletes a book from the library.
 * Corresponds to: DELETE /books/{id}
 * @param id The ID of the book to delete.
 */
const deleteBook = async (id: number): Promise<void> => {
    // The backend returns a success message, but we don't need to process it here.
    // We await the call to ensure the operation completes.
    await apiClient.delete(`/${id}`);
};

/**
 * Updates the number of copies for a specific book.
 * Corresponds to: PATCH /books/{id}/copies?additionalCopies={n}
 * @param id The ID of the book to update.
 * @param additionalCopies The number of copies to add (can be negative to remove).
 * @returns A promise that resolves to the updated book data.
 */
const updateBookCopies = async (id: number, additionalCopies: number): Promise<BookResponseDTO> => {
    const response = await apiClient.patch<BookResponseDTO>(`/${id}/copies`, null, {
        params: { additionalCopies }
    });
    return response.data;
};


// Export all functions as a single service object for easy importing.
export const BookService = {
    getAllBooks,
    searchBooks,
    addBook,
    updateBook,
    deleteBook,
    updateBookCopies,
};