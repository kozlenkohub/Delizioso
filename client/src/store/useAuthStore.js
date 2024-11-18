import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
export const useAuthStore = create((set) => ({
  register: async (formData) => {
    try {
      const response = await axiosInstance.post('/auth/register', formData);
      toast.success(response.data.message || 'User registered successfully');
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong');
    }
  },
  login: async (formData) => {
    try {
      const response = await axiosInstance.post('/auth/login', formData);
      toast.success(response.data.message || 'User logged in successfully');
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong');
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      toast.success('User logged out successfully');
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong');
    }
  },

  forgotPassword: async (formData) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', formData);
      toast.success(response.data.message || 'Password reset link sent to your email');
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong');
    }
  },
  resetPassword: async ({ password, token }) => {
    try {
      const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      toast.success(response.data.message || 'Пароль успешно сброшен');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Произошла ошибка');
    }
  },
}));
