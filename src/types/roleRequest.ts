export interface DocumentItem {
  name: string;
  url: string;
}

export interface RoleRequestUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  roles?: string[];
  profileImage?: string;
  createdAt: string;
  agencyName?: string;
  reraNumber?: string;
}

export interface RoleRequest {
  _id: string;
  user: RoleRequestUser | string;
  currentRole: "buyer" | "seller" | "agent" | "none";
  requestedRole: "seller" | "agent";
  status: "pending" | "approved" | "rejected";
  reason?: string;
  experience?: string;
  agencyName?: string;
  reraNumber?: string;
  documents?: DocumentItem[];
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleRequestStats {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface GetRoleRequestsResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  stats: RoleRequestStats;
  requests: RoleRequest[];
}
