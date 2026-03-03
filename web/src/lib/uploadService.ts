import api from './api';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
  };
}

/**
 * Upload a file to the server
 * @param file - The file to upload
 * @returns Promise with upload response containing the file URL
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Delete a file from the server
 * @param filename - The filename to delete
 */
export const deleteFile = async (filename: string): Promise<void> => {
  await api.delete(`/upload/${filename}`);
};

export default {
  uploadFile,
  deleteFile,
};
