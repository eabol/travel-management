import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface User {
  email: string;
  role: 'requester' | 'approver' | 'admin';
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('jwt_token'));
  const user = ref<User | null>(
    localStorage.getItem('user_info')
      ? JSON.parse(localStorage.getItem('user_info')!)
      : null
  );

  const isAuthenticated = computed(() => !!token.value);
  const userRole = computed(() => user.value?.role || null);

  const login = async (emailInput: string, passwordInput: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/v1/external/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      token.value = data.token;
      user.value = data.user;

      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('user_info', JSON.stringify(data.user));

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
  };

  return {
    token,
    user,
    isAuthenticated,
    userRole,
    login,
    logout
  };
});
