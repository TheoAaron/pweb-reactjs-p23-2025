import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooks } from '@/hooks/useBooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { BookOpen, ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const genres = ['Fiction', 'Science Fiction', 'Romance', 'Mystery', 'Non-Fiction', 'Biography'];

const AddBook = () => {
  const navigate = useNavigate();
  const { createBook } = useBooks();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    writer: '',
    genre: '',
    price: '',
    stock: '',
    description: '',
    publisher: '',
    publicationYear: '',
    isbn: '',
    pages: '',
    language: 'English',
  });

  const totalSteps = 3;

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title || !formData.writer || !formData.genre) {
          toast.error('Missing information', {
            description: 'Please fill in all required fields.',
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.price || !formData.stock) {
          toast.error('Missing information', {
            description: 'Please provide price and stock information.',
          });
          return false;
        }
        if (parseFloat(formData.price) <= 0 || parseInt(formData.stock) < 0) {
          toast.error('Invalid values', {
            description: 'Price must be positive and stock cannot be negative.',
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    try {
      setIsLoading(true);

      await createBook({
        title: formData.title,
        writer: formData.writer,
        genre: formData.genre,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description || undefined,
        publisher: formData.publisher || undefined,
        publicationYear: formData.publicationYear
          ? parseInt(formData.publicationYear)
          : undefined,
        isbn: formData.isbn || undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        language: formData.language,
      });

      // Success animation delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/books');
    } catch (error) {
      // Error handled in useBooks hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-block glass-card rounded-full p-4 mb-4">
          <BookOpen className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Add New Book</h1>
        <p className="text-muted-foreground">
          Expand your library catalog with a new title
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8"
      >
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentStep === 1
                ? 'Basic Information'
                : currentStep === 2
                ? 'Pricing & Stock'
                : 'Additional Details'}
            </span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="title">
                  Book Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-12 glass-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="writer">
                  Author <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="writer"
                  placeholder="Enter author name"
                  value={formData.writer}
                  onChange={(e) => setFormData({ ...formData, writer: e.target.value })}
                  className="h-12 glass-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">
                  Genre <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                  <SelectTrigger className="h-12 glass-card">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {/* Step 2: Pricing & Stock */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (Rp) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="h-12 glass-card"
                  min="0"
                  step="1000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">
                  Stock Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="h-12 glass-card"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the book..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-32 glass-card resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    placeholder="Publisher name"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="h-12 glass-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicationYear">Publication Year</Label>
                  <Input
                    id="publicationYear"
                    type="number"
                    placeholder="2024"
                    value={formData.publicationYear}
                    onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                    className="h-12 glass-card"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    placeholder="978-0-123456-78-9"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="h-12 glass-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pages">Number of Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    placeholder="0"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    className="h-12 glass-card"
                    min="1"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                    <SelectTrigger className="h-12 glass-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Indonesian">Indonesian</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="glass-button"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/books')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button type="button" onClick={handleNext} disabled={isLoading}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading} className="shadow-lg">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Book...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Add Book
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBook;
