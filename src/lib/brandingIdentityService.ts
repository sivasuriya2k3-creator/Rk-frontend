import api from './api';

export interface AdditionalMedia {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  fileFormat?: string;
  _id?: string;
}

export interface BrandingIdentityItem {
  _id: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  additionalMedia?: AdditionalMedia[];
  fileFormat: string;
  tags: string[];
  featured: boolean;
  likes: number;
  likedBy: string[];
  createdBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandingItemData {
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  fileFormat: string;
  tags?: string[];
  featured?: boolean;
}

// Get all branding identity items
export const getAllBrandingItems = async (): Promise<BrandingIdentityItem[]> => {
  const response = await api.get('/branding');
  return response.data.data;
};

// Get single branding identity item
export const getBrandingItem = async (id: string): Promise<BrandingIdentityItem> => {
  const response = await api.get(`/branding/${id}`);
  return response.data.data;
};

// Create new branding identity item
export const createBrandingItem = async (data: CreateBrandingItemData): Promise<BrandingIdentityItem> => {
  const response = await api.post('/branding', data);
  return response.data.data;
};

// Update branding identity item
export const updateBrandingItem = async (id: string, data: Partial<CreateBrandingItemData>): Promise<BrandingIdentityItem> => {
  const response = await api.put(`/branding/${id}`, data);
  return response.data.data;
};

// Delete branding identity item
export const deleteBrandingItem = async (id: string): Promise<void> => {
  await api.delete(`/branding/${id}`);
};

// Like branding identity item
export const likeBrandingItem = async (id: string): Promise<{ likes: number; likedBy: string[] }> => {
  const response = await api.post(`/branding/${id}/like`);
  return response.data.data;
};

// Unlike branding identity item
export const unlikeBrandingItem = async (id: string): Promise<{ likes: number; likedBy: string[] }> => {
  const response = await api.delete(`/branding/${id}/like`);
  return response.data.data;
};

// Add additional media to branding item
export const addAdditionalMedia = async (
  id: string, 
  mediaData: { mediaType: 'image' | 'video'; mediaUrl: string; fileFormat?: string }
): Promise<BrandingIdentityItem> => {
  const response = await api.post(`/branding/${id}/media`, mediaData);
  return response.data.data;
};
