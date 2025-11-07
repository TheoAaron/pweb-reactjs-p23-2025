import axios, { AxiosError } from 'axios';
import { Book, Transaction, User, CartItem } from '@/types';


import imgGatsby from "../assets/the_great_gatsby.png";
import imgMockingbird from "../assets/to_kill_a_mockingbird.jpg";
import img1984 from "../assets/1984.png";
import imgPride from "../assets/pride_and_prejudice.jpg";

// Backend API base URL
const API_BASE_URL = 'http://localhost:8080';

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
    console.error('API Error:', error.response?.status, error.response?.data);
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
    const response = await api.post('/auth/login', { email, password });
    // Backend may return { user, token } or nested structure
    return response.data;
  },

  register: async (email: string, password: string, name: string): Promise<{ user: User; token: string }> => {
    // Backend expects 'username' field, not 'name'
    const response = await api.post('/auth/register', { email, password, username: name });
    return response.data;
  },
};

// Helper function to transform backend book format to frontend Book format
const transformBackendBook = (backendBook: any): Book => {
  return {
    id: backendBook.id,
    title: backendBook.title,
    writer: backendBook.writer,
    publisher: backendBook.publisher,
    // Backend returns camelCase: publicationYear
    publicationYear: backendBook.publicationYear,
    description: backendBook.description,
    price: typeof backendBook.price === 'string' ? parseFloat(backendBook.price) : backendBook.price,
    // Backend returns camelCase: stockQuantity
    stock: backendBook.stockQuantity,
    genre: typeof backendBook.genre === 'object' && backendBook.genre ? backendBook.genre.name : (backendBook.genreId || 'Unknown'),
    coverImage: backendBook.coverImage || backendBook.cover_image,
    rating: backendBook.rating,
    createdAt: backendBook.createdAt || new Date().toISOString(),
    updatedAt: backendBook.updatedAt || new Date().toISOString(),
  };
};

// Books API
export const booksAPI = {
  getAll: async (params?: { search?: string; genre?: string; sort?: string }): Promise<Book[]> => {
    // Transform frontend params to backend expected params
    const backendParams: any = {};
    if (params?.search) backendParams.q = params.search;
    if (params?.genre && params.genre !== 'all') backendParams.genre = params.genre;
    if (params?.sort) backendParams.sort = params.sort;
    
    console.log('Fetching books with params:', backendParams);
    const response = await api.get('/books', { params: backendParams });
    console.log('Books response:', response.data);
    // Backend returns { data: books[], meta: { ... } }
    const books = response.data.data || response.data;
    // Transform each book from backend format to frontend format
    return Array.isArray(books) ? books.map(transformBackendBook) : [];
  },

  getById: async (id: string): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    // Backend returns { book: {...} }
    const book = response.data.book || response.data;
    return transformBackendBook(book);
  },

  create: async (bookData: Partial<Book>): Promise<Book> => {
    // Transform frontend Book format to backend expected format
    const backendFormat = {
      title: bookData.title,
      writer: bookData.writer,
      publisher: bookData.publisher,
      publication_year: bookData.publicationYear,
      description: bookData.description,
      price: bookData.price,
      stock_quantity: bookData.stock,
      genre_id: bookData.genre, // This should be genre UUID from backend
    };
    const response = await api.post('/books', backendFormat);
    const book = response.data.book || response.data;
    return transformBackendBook(book);
  },

  update: async (id: string, bookData: Partial<Book>): Promise<Book> => {
    // Transform frontend Book format to backend expected format
    const backendFormat: any = {};
    if (bookData.title !== undefined) backendFormat.title = bookData.title;
    if (bookData.writer !== undefined) backendFormat.writer = bookData.writer;
    if (bookData.publisher !== undefined) backendFormat.publisher = bookData.publisher;
    if (bookData.publicationYear !== undefined) backendFormat.publication_year = bookData.publicationYear;
    if (bookData.description !== undefined) backendFormat.description = bookData.description;
    if (bookData.price !== undefined) backendFormat.price = bookData.price;
    if (bookData.stock !== undefined) backendFormat.stock_quantity = bookData.stock;
    if (bookData.genre !== undefined) backendFormat.genre_id = bookData.genre;
    
    const response = await api.patch(`/books/${id}`, backendFormat);
    const book = response.data.book || response.data;
    return transformBackendBook(book);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
};

// Transactions API
export const transactionsAPI = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get('/transactions');
    // Backend may return { data: [...] } or direct array
    return response.data.data || response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data.transaction || response.data;
  },

  create: async (items: { bookId: string; quantity: number }[]): Promise<Transaction> => {
    // Transform bookId to book_id for backend
    const backendItems = items.map(item => ({
      book_id: item.bookId,
      quantity: item.quantity
    }));
    const response = await api.post('/transactions', { items: backendItems });
    return response.data.transaction || response.data;
  },
};

// Genres API
export const genresAPI = {
  getAll: async (): Promise<{ id: string; name: string }[]> => {
    const response = await api.get('/genre');
    // Backend returns { data: [...] }
    return response.data.data || response.data;
  },

  getById: async (id: string): Promise<{ id: string; name: string }> => {
    const response = await api.get(`/genre/${id}`);
    return response.data.genre || response.data;
  },

  create: async (genreData: { name: string }): Promise<{ id: string; name: string }> => {
    const response = await api.post('/genre', genreData);
    return response.data.genre || response.data;
  },

  update: async (id: string, genreData: { name: string }): Promise<{ id: string; name: string }> => {
    const response = await api.patch(`/genre/${id}`, genreData);
    return response.data.genre || response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/genre/${id}`);
  },
};

export default api;

// Helper function to get genre ID by name
export async function getGenreIdByName(genreName: string): Promise<string | null> {
  try {
    const genres = await genresAPI.getAll();
    const genre = genres.find(g => g.name.toLowerCase() === genreName.toLowerCase());
    return genre?.id || null;
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return null;
  }
}
