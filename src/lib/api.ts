import axios, { AxiosError } from 'axios';
import { Book, Transaction, User, CartItem } from '@/types';

// Mock API base URL - replace with your actual API
const API_BASE_URL = 'https://api.example.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      token: 'mock-token-' + Date.now(),
    };
    
    return { user: mockUser, token: mockUser.token };
  },

  register: async (email: string, password: string, name: string): Promise<{ user: User; token: string }> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      token: 'mock-token-' + Date.now(),
    };
    
    return { user: mockUser, token: mockUser.token };
  },
};

// Books API
export const booksAPI = {
  getAll: async (params?: { search?: string; genre?: string; sort?: string }): Promise<Book[]> => {
    // Mock implementation with sample books
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockBooks: Book[] = [
      {
        id: '1',
        title: 'The Great Gatsby',
        writer: 'F. Scott Fitzgerald',
        price: 120000,
        stock: 15,
        genre: 'Fiction',
        description: 'A classic novel about the American Dream in the 1920s',
        publisher: 'Scribner',
        publicationYear: 1925,
        isbn: '978-0-7432-7356-5',
        pages: 180,
        language: 'English',
        rating: 4.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        writer: 'Harper Lee',
        price: 95000,
        stock: 20,
        genre: 'Fiction',
        description: 'A gripping tale of racial injustice and childhood innocence',
        publisher: 'J.B. Lippincott & Co.',
        publicationYear: 1960,
        isbn: '978-0-06-112008-4',
        pages: 324,
        language: 'English',
        rating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: '1984',
        writer: 'George Orwell',
        price: 110000,
        stock: 12,
        genre: 'Science Fiction',
        description: 'A dystopian social science fiction novel',
        publisher: 'Secker & Warburg',
        publicationYear: 1949,
        isbn: '978-0-452-28423-4',
        pages: 328,
        language: 'English',
        rating: 4.6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Pride and Prejudice',
        writer: 'Jane Austen',
        price: 85000,
        stock: 18,
        genre: 'Romance',
        description: 'A romantic novel of manners',
        publisher: 'T. Egerton',
        publicationYear: 1813,
        isbn: '978-0-14-143951-8',
        pages: 432,
        language: 'English',
        rating: 4.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    let filtered = [...mockBooks];
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(search) ||
        book.writer.toLowerCase().includes(search)
      );
    }
    
    if (params?.genre && params.genre !== 'all') {
      filtered = filtered.filter(book => book.genre === params.genre);
    }
    
    return filtered;
  },

  getById: async (id: string): Promise<Book> => {
    const books = await booksAPI.getAll();
    const book = books.find(b => b.id === id);
    if (!book) throw new Error('Book not found');
    return book;
  },

  create: async (bookData: Partial<Book>): Promise<Book> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newBook: Book = {
      id: Date.now().toString(),
      title: bookData.title || '',
      writer: bookData.writer || '',
      price: bookData.price || 0,
      stock: bookData.stock || 0,
      genre: bookData.genre || '',
      description: bookData.description,
      publisher: bookData.publisher,
      publicationYear: bookData.publicationYear,
      isbn: bookData.isbn,
      pages: bookData.pages,
      language: bookData.language || 'English',
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newBook;
  },

  update: async (id: string, bookData: Partial<Book>): Promise<Book> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const book = await booksAPI.getById(id);
    return { ...book, ...bookData, updatedAt: new Date().toISOString() };
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};

// Transactions API
export const transactionsAPI = {
  getAll: async (): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  },

  getById: async (id: string): Promise<Transaction> => {
    const transactions = await transactionsAPI.getAll();
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  },

  create: async (items: { bookId: string; quantity: number }[]): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const books = await booksAPI.getAll();
    const cartItems: CartItem[] = items.map(item => {
      const book = books.find(b => b.id === item.bookId);
      if (!book) throw new Error(`Book ${item.bookId} not found`);
      return {
        bookId: item.bookId,
        book,
        quantity: item.quantity,
      };
    });
    
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      userId: '1',
      items: cartItems,
      totalAmount,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return transaction;
  },
};

export default api;
