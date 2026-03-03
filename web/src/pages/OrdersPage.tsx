import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import orderService, { Order } from '@/lib/orderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Calendar,
  IndianRupee,
  User,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const ordersData = await orderService.getOrders();
      setOrders(ordersData);
    } catch (err: any) {
      setError('Failed to load orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in-progress':
        return <RefreshCw className="w-4 h-4 text-slate-400" />;
      case 'review':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      pending: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
      'in-progress': 'bg-slate-700/20 text-slate-300 dark:text-slate-200 border-slate-700/30',
      review: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
      completed: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Order['priority']) => {
    const variants = {
      low: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
      high: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
      urgent: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
    };

    return (
      <Badge className={`${variants[priority]} border text-xs`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 max-w-6xl pt-20 md:pt-24 pb-8 md:pb-12">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold gradient-text mb-2 break-words">My Orders</h1>
              <p className="text-xs md:text-sm text-muted-foreground break-words">Track and manage your project orders</p>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="gap-2 text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10 w-full sm:w-auto"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Orders Grid */}
        {orders.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-8 md:py-12">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No orders yet</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-6">
                You haven't placed any orders yet. Browse our services to get started.
              </p>
              <Button
                onClick={() => window.location.href = '/services'}
                className="bg-accent hover:bg-accent/90 shadow-gold text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 h-8 md:h-10"
              >
                Browse Services
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {orders.map((order) => (
              <Card key={order._id} className="bg-card border-border hover:border-accent/50 transition-all duration-300 hover:shadow-gold">
                <CardHeader className="pb-3 md:pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                    {getPriorityBadge(order.priority)}
                  </div>

                  <CardTitle className="text-base md:text-lg text-foreground line-clamp-2">
                    {order.title}
                  </CardTitle>

                  <CardDescription className="text-xs md:text-sm text-muted-foreground">
                    {order.service}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 md:space-y-4">
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-3">
                    {order.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <IndianRupee className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        Budget
                      </div>
                      <span className="text-accent font-semibold">₹{order.budget.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        Timeline
                      </div>
                      <span className="text-foreground">{order.timeline}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        Ordered
                      </div>
                      <span className="text-foreground">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-accent/50 text-accent hover:bg-accent/10 hover:border-accent text-xs md:text-sm py-1 md:py-2 h-8 md:h-10"
                    onClick={() => window.location.href = `/orders/${order._id}`}
                  >
                    <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {orders.length > 0 && (
          <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <Card className="bg-card border-border">
              <CardContent className="text-center py-3 md:py-4">
                <div className="text-xl md:text-2xl font-bold text-accent">{orders.length}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Total Orders</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="text-center py-3 md:py-4">
                <div className="text-xl md:text-2xl font-bold text-accent">
                  {orders.filter(o => o.status === 'completed').length}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="text-center py-4">
                <div className="text-2xl font-bold text-accent">
                  {orders.filter(o => o.status === 'in-progress').length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="text-center py-4">
                <div className="text-2xl font-bold text-accent">
                  {orders.filter(o => o.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
