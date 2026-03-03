import api from './api';

export interface RevenueTransaction {
  type: 'order' | 'project' | 'refund' | 'payment';
  amount: number;
  orderId?: string;
  projectId?: string;
  description: string;
  timestamp: string;
}

export interface Revenue {
  _id: string;
  date: string;
  totalRevenue: number;
  ordersCount: number;
  projectsCompleted: number;
  newClients: number;
  transactions: RevenueTransaction[];
  expenses: number;
  netProfit: number;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueStats {
  today: {
    revenue: number;
    orders: number;
    profit: number;
  };
  week: {
    revenue: number;
    orders: number;
  };
  month: {
    revenue: number;
    orders: number;
  };
  chart: {
    date: string;
    revenue: number;
    orders: number;
    profit: number;
  }[];
}

const revenueService = {
  async getRevenue(startDate?: string, endDate?: string): Promise<Revenue[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/revenue?${params.toString()}`);
    return response.data;
  },

  async getRevenueByDate(date: string): Promise<Revenue> {
    const response = await api.get(`/revenue/${date}`);
    return response.data;
  },

  async updateTodayRevenue(): Promise<{ message: string; revenue: Revenue }> {
    const response = await api.post('/revenue/update-today');
    return response.data;
  },

  async getRevenueStats(): Promise<RevenueStats> {
    const response = await api.get('/revenue/stats');
    return response.data;
  },
};

export default revenueService;
