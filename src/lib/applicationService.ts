import axios from 'axios';

const API_BASE_URL = '/api/applications';

export const applicationService = {
  async submitApplication(data: any) {
    const response = await axios.post(`${API_BASE_URL}/apply`, data);
    return response.data;
  },

  async getAllApplications() {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  async getApplicationById(id: string) {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  async acceptApplication(id: string, adminNotes: string) {
    const response = await axios.put(`${API_BASE_URL}/${id}/accept`, { adminNotes });
    return response.data;
  },

  async rejectApplication(id: string, adminNotes: string) {
    const response = await axios.put(`${API_BASE_URL}/${id}/reject`, { adminNotes });
    return response.data;
  },

  async deleteApplication(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }
};
