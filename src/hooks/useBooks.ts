import { useState, useEffect } from 'react';
import { Book } from '@/types';
import { booksAPI, getGenreIdByName } from '@/lib/api';
import { toast } from 'sonner';

export const useBooks = (params?: { search?: string; genre?: string; sort?: string }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, [params?.search, params?.genre, params?.sort]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await booksAPI.getAll(params);
      setBooks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch books';
      setError(message);
      toast.error('Error loading books', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const createBook = async (bookData: Partial<Book>) => {
    try {
      // If genre is a string (name), convert to ID
      if (bookData.genre && typeof bookData.genre === 'string') {
        const genreId = await getGenreIdByName(bookData.genre);
        if (!genreId) {
          throw new Error(`Genre "${bookData.genre}" not found. Please select a valid genre.`);
        }
        bookData.genre = genreId;
      }
      
      const newBook = await booksAPI.create(bookData);
      setBooks(prev => [newBook, ...prev]);
      toast.success('Book added successfully! 📚', {
        description: `"${newBook.title}" has been added to the catalog.`,
      });
      return newBook;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create book';
      toast.error('Failed to add book', { description: message });
      throw err;
    }
  };

  const updateBook = async (id: string, bookData: Partial<Book>) => {
    try {
      // If genre is a string (name), convert to ID
      if (bookData.genre && typeof bookData.genre === 'string') {
        const genreId = await getGenreIdByName(bookData.genre);
        if (!genreId) {
          throw new Error(`Genre "${bookData.genre}" not found. Please select a valid genre.`);
        }
        bookData.genre = genreId;
      }
      
      const updatedBook = await booksAPI.update(id, bookData);
      setBooks(prev => prev.map(book => book.id === id ? updatedBook : book));
      toast.success('Book updated! ✨', {
        description: 'Changes have been saved.',
      });
      return updatedBook;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update book';
      toast.error('Failed to update book', { description: message });
      throw err;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await booksAPI.delete(id);
      setBooks(prev => prev.filter(book => book.id !== id));
      toast.success('Book removed', {
        description: 'The book has been deleted from the catalog.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete book';
      toast.error('Failed to delete book', { description: message });
      throw err;
    }
  };

  return {
    books,
    isLoading,
    error,
    refetch: fetchBooks,
    createBook,
    updateBook,
    deleteBook,
  };
};
