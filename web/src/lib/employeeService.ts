import api from './api';

export const employeeService = {
  // Get all employees
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/employees?${params}`);
    return response.data;
  },

  // Get single employee
  getById: async (id: string) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create employee
  create: async (employeeData: any) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  // Update employee
  update: async (id: string, employeeData: any) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  // Delete employee
  delete: async (id: string) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get('/employees/stats');
    return response.data;
  }
};
