import type { User } from '../types';
import { MOCK_USERS } from '../mocks/data';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateToken(): string {
  return `token_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

interface AuthResult {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResult | null> {
    await delay(800);

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return null;
    }

    const { password: _p, ...userData } = user;
    const token = generateToken();

    return { user: userData, token };
  },

  async register(name: string, email: string, _password: string): Promise<AuthResult | null> {
    await delay(800);

    const exists = MOCK_USERS.find((u) => u.email === email);
    if (exists) {
      return null;
    }

    const newUser: User = {
      id: `user_${Math.random().toString(36).slice(2, 9)}`,
      name,
      email,
      roles: ['investor'],
      createdAt: new Date().toISOString(),
    };

    const token = generateToken();

    return { user: newUser, token };
  },

  async forgotPassword(_email: string): Promise<boolean> {
    await delay(800);
    return true;
  },

  async updateProfile(_updates: Partial<User>): Promise<boolean> {
    await delay(500);
    return true;
  },

  async changePassword(currentPassword: string, _newPassword: string): Promise<boolean> {
    await delay(500);
    if (currentPassword.length < 6) {
      return false;
    }
    return true;
  },

  async socialLogin(provider: 'google' | 'github'): Promise<AuthResult> {
    await delay(1200);
    const user: User = {
      id: `social_${provider}`,
      name: provider === 'google' ? 'Usuário Google' : 'Usuário GitHub',
      email: `${provider}@descin.com`,
      roles: ['investor'],
      createdAt: new Date().toISOString(),
    };
    return { user, token: generateToken() };
  },
};
