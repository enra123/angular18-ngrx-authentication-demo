export class User {
  email: string;
  permissions: string[];
}

export class AuthState {
  token: string;
  error: string;
  user: User;
  isLoading: boolean;
}
