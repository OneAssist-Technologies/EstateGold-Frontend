import api from "../lib/api";

export const authApi = {
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    referralCode?: string;
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  verifyOtp: (data: { email: string; otp: string }) =>
    api.post("/auth/verify-otp", data),

  resetPassword: (data: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }) => api.post("/auth/reset-password", data),
};
