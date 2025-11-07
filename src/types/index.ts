export interface User {
  id: string;
  email: string;
  username?: string | null;
  token?: string;
}

export interface Book {
  id: string;
  title: string;
  writer: string;
  coverImage?: string;
  price: number;
  stock: number;
  genre: string;
  description?: string;
  publisher?: string;
  publicationYear?: number;
  isbn?: string;
  pages?: number;
  language?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  bookId: string;
  book: Book;
  quantity: number;
}

export interface Transaction {
  id: string;
  userId: string;
  user?: User;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
