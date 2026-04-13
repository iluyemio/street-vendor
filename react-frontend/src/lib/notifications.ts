import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  pauseOnHover: true,
  draggable: true,
  pauseOnFocusLoss: true,
};

export const notifySuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, { ...defaultOptions, ...options });
};

export const notifyError = (message: string, options?: ToastOptions) => {
  return toast.error(message, { ...defaultOptions, ...options });
};

export const notifyInfo = (message: string, options?: ToastOptions) => {
  return toast.info(message, { ...defaultOptions, ...options });
};

export const notifyWarning = (message: string, options?: ToastOptions) => {
  return toast.warning(message, { ...defaultOptions, ...options });
};
