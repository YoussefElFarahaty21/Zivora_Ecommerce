export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface CreateUserDTO {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}
