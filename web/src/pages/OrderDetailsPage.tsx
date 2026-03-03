import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import orderService, { Order } from '@/lib/orderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  DollarSign,
  User,
  RefreshCw,
  MessageSquare,
  FileText,
  Ban
} from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const orderData = await orderService.getOrder(id);
      setOrder(orderData);
    } catch (err: any) {
      setError('Failed to load order details. Please try again.');
      console.error('Error fetching order details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!id) return;

    try {
      setIsCanceling(true);
      await orderService.cancelOrder(id, cancelReason);
      // Redirect to orders page after successful cancellation
      navigate('/orders', { 
        state: { message: 'Order canceled successfully and moved to canceled projects' }
      });
    } catch (err: any) {
      setError('Failed to cancel order. Please try again.');
      console.error('Error canceling order:', err);
    } finally {
      setIsCanceling(false);
      setShowCancelDialog(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in-progress':
        return <RefreshCw className="w-5 h-5 text-slate-400" />;
      case 'review':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
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
      <Badge className={`${variants[status]} border text-sm px-3 py-1`}>
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
        {priority.toUpperCase()} PRIORITY
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Error</h2>
              <p className="text-muted-foreground mb-6">
                {error || 'Order not found'}
              </p>
              <Button
                onClick={() => navigate('/orders')}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 max-w-4xl pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/orders')}
            variant="outline"
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 break-words">{order.title}</h1>
              <p className="text-muted-foreground break-words">{order.service}</p>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(order.status)}
              {getStatusBadge(order.status)}
              {getPriorityBadge(order.priority)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Description */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Project Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed break-words">{order.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {order.requirements && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Additional Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed break-words">{order.requirements}</p>
                </CardContent>
              </Card>
            )}

            {/* Notes/Updates */}
            {order.notes && order.notes.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Project Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.notes.map((note, index) => (
                    <div key={index} className="border-l-2 border-accent pl-4">
                      <p className="text-muted-foreground mb-2 break-words">{note.message}</p>
                      <div className="flex items-center text-sm text-muted-foreground break-words">
                        <User className="w-3 h-3 mr-1" />
                        {note.author.name} • {formatDate(note.createdAt)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="text-foreground font-semibold text-lg">₹{order.budget.toLocaleString('en-IN')}</span>
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Timeline</span>
                  <span className="text-foreground">{order.timeline}</span>
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Priority</span>
                  {getPriorityBadge(order.priority)}
                </div>

                <Separator className="bg-border" />

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Ordered: {formatDate(order.createdAt)}
                  </div>

                  {order.estimatedCompletion && (
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Est. Completion: {formatDate(order.estimatedCompletion)}
                    </div>
                  )}

                  {order.actualCompletion && (
                    <div className="flex items-center text-muted-foreground text-sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed: {formatDate(order.actualCompletion)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-foreground">{order.user.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground">@</span>
                    <span className="text-muted-foreground ml-2">{order.user.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-border text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent"
                  onClick={() => navigate('/contact')}
                >
                  Contact Support
                </Button>

                {(order.status === 'pending' || order.status === 'in-progress') && (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:border-red-500"
                    onClick={() => setShowCancelDialog(true)}
                    disabled={isCanceling}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center">
              <Ban className="w-5 h-5 mr-2 text-muted-foreground" />
              Cancel Order
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to cancel this order? This action cannot be undone. 
              The order will be moved to canceled projects.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Reason for cancellation (optional)
              </label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for canceling this order..."
                className="bg-secondary border-border text-foreground min-h-[100px]"
                disabled={isCanceling}
              />
            </div>

            <Alert className="bg-accent/10 border-accent/30">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertDescription className="text-foreground">
                This will permanently move the order to your canceled projects folder.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isCanceling}
              className="bg-transparent border-border text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent"
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCanceling}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isCanceling ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Canceling...
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Cancel Order
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
