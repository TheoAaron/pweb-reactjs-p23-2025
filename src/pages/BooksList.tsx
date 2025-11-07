import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooks } from '@/hooks/useBooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookCardSkeleton } from '@/components/LoadingSkeleton';
import imgGatsby from "../assets/the_great_gatsby.png";
import imgMockingbird from "../assets/to_kill_a_mockingbird.jpg";
import img1984 from "../assets/1984.png";
import imgPride from "../assets/pride_and_prejudice.jpg";
import LogoImg from "@/assets/logo.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, BookOpen, ShoppingCart } from 'lucide-react';
import { Book } from '@/types';

const genres = ['all', 'Fiction', 'Science Fiction', 'Romance', 'Mystery', 'Non-Fiction', 'Biography'];

const BookCard = ({ book }: { book: Book }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8 }}
    className="glass-card rounded-2xl overflow-hidden hover-lift group"
  >
    <div className="relative h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
      {book.coverImage ? (
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <BookOpen className="w-24 h-24 text-primary/50" />
      )}
      <div className="absolute top-4 right-4">
        <div className="glass-button px-3 py-1 rounded-full text-sm font-semibold">
          {book.genre}
        </div>
      </div>
    </div>

    <div className="p-6 space-y-3">
      <div>
        <h3 className="text-xl font-bold mb-1 line-clamp-2 group-hover:gradient-text transition-all">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground">by {book.writer}</p>
      </div>

      {book.rating && (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-lg ${
                i < Math.floor(book.rating!) ? 'text-accent' : 'text-muted'
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-sm text-muted-foreground ml-2">({book.rating})</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="text-2xl font-bold text-primary">
            Rp {book.price.toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-muted-foreground">Stock: {book.stock}</p>
        </div>
        <Link to={`/books/${book.id}`}>
          <Button className="shadow-lg hover:shadow-xl transition-all">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  </motion.div>
);

const BooksList = () => {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');
  const { books, isLoading } = useBooks({ search, genre });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Book Catalog</h1>
            <p className="text-muted-foreground">
              Discover and explore our collection of {books.length} books
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Filters & Search</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search books by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 glass-card border-primary/20 focus:border-primary transition-all"
              />
            </div>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="h-12 glass-card border-primary/20 focus:border-primary">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent className="glass-card">
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g === 'all' ? 'All Genres' : g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <BookOpen className="w-24 h-24 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No books found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters
          </p>
          <Button onClick={() => { setSearch(''); setGenre('all'); }}>
            Clear Filters
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default BooksList;
