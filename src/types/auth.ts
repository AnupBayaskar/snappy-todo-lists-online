export type UserRole =
  | "super-admin"
  | "organization-lead"
  | "team-lead"
  | "validator"
  | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  avatar?: string;
  teams: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string,
    organizationId?: string
  ) => Promise<void>;
  loading: boolean;
}
