import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../stores/auth';

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should initialize with unauthenticated state', () => {
    // Arrange & Act
    const authStore = useAuthStore();

    // Assert
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
  });

  it('should handle successful login and update state', async () => {
    // Arrange
    const authStore = useAuthStore();
    const mockToken = 'mock_jwt_token_string';
    const mockUser = { email: 'admin@institution.gob.ec', role: 'admin' as const };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: mockToken, user: mockUser })
    });

    // Act
    const success = await authStore.login('admin@institution.gob.ec', 'AdminPassword123!');

    // Assert
    expect(success).toBe(true);
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.token).toBe(mockToken);
    expect(authStore.user).toEqual(mockUser);
    expect(localStorage.getItem('jwt_token')).toBe(mockToken);
  });

  it('should handle login failure and maintain unauthenticated state', async () => {
    // Arrange
    const authStore = useAuthStore();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401
    });

    // Act
    const success = await authStore.login('admin@institution.gob.ec', 'WrongPassword');

    // Assert
    expect(success).toBe(false);
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.token).toBeNull();
  });
});
