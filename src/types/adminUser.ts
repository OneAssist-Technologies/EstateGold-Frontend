export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "buyer" | "seller" | "agent" | "admin";
  city?: string;
  ownerName?: string;
  agencyName?: string;
  reraNumber?: string;
  profileImage?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalBuyers: number;
  totalSellers: number;
  verifiedAgents: number;
  totalUsers: number;
}

export interface GetUsersResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  users: AdminUser[];
  stats: UserStats;
}
