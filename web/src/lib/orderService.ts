import api from './api';

export interface ClientInfo {
  companyName?: string;
  industry?: string;
  website?: string;
  phone?: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp' | 'teams';
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  service: string;
  clientInfo?: ClientInfo;
  title: string;
  description: string;
  budget: number;
  timeline: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  requirements?: string;
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: string;
  }>;
  estimatedCompletion?: string;
  actualCompletion?: string;
  notes?: Array<{
    message: string;
    author: {
      _id: string;
      name: string;
    };
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  service: string;
  clientInfo?: ClientInfo;
  title: string;
  description: string;
  budget: number;
  timeline: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  requirements?: string;
}

export interface UpdateOrderData {
  title?: string;
  description?: string;
  budget?: number;
  timeline?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  requirements?: string;
}

class OrderService {
  async getOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', orderData);
    return response.data.data;
  }

  async updateOrder(id: string, orderData: UpdateOrderData): Promise<Order> {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data.data;
  }

  async deleteOrder(id: string): Promise<void> {
    await api.delete(`/orders/${id}`);
  }

  async cancelOrder(id: string, reason?: string): Promise<void> {
    await api.delete(`/orders/${id}/cancel`, { data: { reason } });
  }

  async getCanceledOrders(): Promise<Order[]> {
    const response = await api.get('/orders/canceled');
    return response.data.data;
  }

  // Admin functions
  async getAllOrdersAdmin(): Promise<Order[]> {
    const response = await api.get('/orders/admin/all');
    return response.data.data;
  }

  async getAllCanceledOrders(page = 1, limit = 25): Promise<{ data: Order[]; pagination: any }> {
    const response = await api.get(`/orders/admin/canceled?page=${page}&limit=${limit}`);
    return response.data;
  }

  async updateOrderStatus(id: string, status: Order['status'], notes?: string): Promise<Order> {
    const response = await api.patch(`/orders/${id}/status`, { status, notes });
    return response.data.data;
  }
}

export default new OrderService();