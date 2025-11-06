import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { booksAPI } from '@/lib/api';
import { Book } from '@/types';
import { Button } from '@/components/ui/button';
import { BookDetailSkeleton } from '@/components/LoadingSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Globe,
  FileText,
  Building,
  Hash,
  ShoppingCart,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchBook(id);
    }
  }, [id]);

  const fetchBook = async (bookId: string) => {
    try {
      setIsLoading(true);
      const data = await booksAPI.getById(bookId);
      setBook(data);
    } catch (error) {
      toast.error('Failed to load book details');
      navigate('/books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    toast.success('Added to cart! 🛒', {
      description: `${quantity} × ${book?.title}`,
    });
  };

  if (isLoading) {
    return <BookDetailSkeleton />;
  }

  if (!book) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/books">
          <Button variant="outline" className="glass-button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Button>
        </Link>
      </motion.div>

      {/* Book Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Book Cover */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative aspect-[3/4] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden shadow-2xl"
          >
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="w-32 h-32 text-primary/50" />
              </div>
            )}
          </motion.div>

          {/* Book Info */}
          <div className="space-y-6">
            <div>
              <div className="inline-block glass-button px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {book.genre}
              </div>
              <h1 className="text-4xl font-bold mb-3 gradient-text">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.writer}</p>

              {book.rating && (
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(book.rating!)
                          ? 'fill-accent text-accent'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                  <span className="text-lg font-semibold ml-2">{book.rating}</span>
                </div>
              )}
            </div>

            {/* Price and Stock */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-primary">
                  Rp {book.price.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stock available:</span>
                <span className="font-semibold text-lg">{book.stock} units</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    disabled={quantity >= book.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={book.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              {book.publicationYear && (
                <div className="glass-card rounded-xl p-4 flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Published</p>
                    <p className="font-semibold">{book.publicationYear}</p>
                  </div>
                </div>
              )}
              {book.language && (
                <div className="glass-card rounded-xl p-4 flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Language</p>
                    <p className="font-semibold">{book.language}</p>
                  </div>
                </div>
              )}
              {book.pages && (
                <div className="glass-card rounded-xl p-4 flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pages</p>
                    <p className="font-semibold">{book.pages}</p>
                  </div>
                </div>
              )}
              {book.publisher && (
                <div className="glass-card rounded-xl p-4 flex items-center space-x-3">
                  <Building className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Publisher</p>
                    <p className="font-semibold text-sm">{book.publisher}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t px-8 pb-8">
          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="glass-card">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Additional Details</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {book.description ||
                    'No description available for this book. The content and story details will be updated soon.'}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {book.isbn && (
                  <div className="flex items-start space-x-3">
                    <Hash className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold mb-1">ISBN</p>
                      <p className="text-muted-foreground">{book.isbn}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Added to Catalog</p>
                    <p className="text-muted-foreground">
                      {new Date(book.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default BookDetail;
