import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { transactionsAPI } from '@/lib/api';
import { Transaction } from '@/types';
import { TransactionSkeleton } from '@/components/LoadingSkeleton';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calendar, DollarSign, Package } from 'lucide-react';
import { toast } from 'sonner';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  completed: 'bg-green-500/20 text-green-700 dark:text-green-400',
  cancelled: 'bg-red-500/20 text-red-700 dark:text-red-400',
};

const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="glass-card rounded-2xl p-6 hover-lift"
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-bold mb-1">Transaction #{transaction.id}</h3>
        <div className="flex items-center text-sm text-muted-foreground space-x-2">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(transaction.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
      <Badge className={statusColors[transaction.status]}>
        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
      </Badge>
    </div>

    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-muted-foreground">
          <Package className="w-4 h-4 mr-2" />
          <span>{transaction.items.length} items</span>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="space-y-2">
          {transaction.items.slice(0, 2).map((item) => (
            <div key={item.bookId} className="flex justify-between text-sm">
              <span className="text-muted-foreground truncate mr-2">
                {item.book.title} × {item.quantity}
              </span>
              <span className="font-medium">
                Rp {(item.book.price * item.quantity).toLocaleString('id-ID')}
              </span>
            </div>
          ))}
          {transaction.items.length > 2 && (
            <p className="text-xs text-muted-foreground">
              +{transaction.items.length - 2} more items
            </p>
          )}
        </div>
      </div>

      <div className="border-t pt-3 flex items-center justify-between">
        <div className="flex items-center text-muted-foreground">
          <DollarSign className="w-4 h-4 mr-1" />
          <span className="text-sm">Total</span>
        </div>
        <span className="text-xl font-bold text-primary">
          Rp {transaction.totalAmount.toLocaleString('id-ID')}
        </span>
      </div>
    </div>

    <Link to={`/transactions/${transaction.id}`} className="block mt-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full glass-button py-2 rounded-xl text-sm font-medium transition-all"
      >
        View Details
      </motion.button>
    </Link>
  </motion.div>
);

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await transactionsAPI.getAll();
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const totalSpent = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalItems = transactions.reduce((sum, t) => sum + t.items.length, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Transaction History</h1>
        <p className="text-muted-foreground">
          Track and manage your book purchases
        </p>
      </motion.div>

      {/* Stats */}
      {!isLoading && transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                <p className="text-3xl font-bold gradient-text">{transactions.length}</p>
              </div>
              <div className="glass-button rounded-full p-4">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Books Purchased</p>
                <p className="text-3xl font-bold gradient-text">{totalItems}</p>
              </div>
              <div className="glass-button rounded-full p-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                <p className="text-2xl font-bold gradient-text">
                  Rp {totalSpent.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="glass-button rounded-full p-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Transactions List */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <TransactionSkeleton key={i} />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-12 text-center"
        >
          <ShoppingCart className="w-24 h-24 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No transactions yet</h3>
          <p className="text-muted-foreground mb-6">
            Start browsing books to make your first purchase
          </p>
          <Link to="/books">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg"
            >
              Browse Books
            </motion.button>
          </Link>
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Transactions;
