const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
};

class Storage {
  setAccessToken(token: string): void {
    localStorage.setItem(KEYS.ACCESS_TOKEN, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(KEYS.ACCESS_TOKEN);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(KEYS.REFRESH_TOKEN);
  }

  setUser(user: any): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }

  getUser(): any | null {
    const user = localStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  clearAuth(): void {
    localStorage.removeItem(KEYS.ACCESS_TOKEN);
    localStorage.removeItem(KEYS.REFRESH_TOKEN);
    localStorage.removeItem(KEYS.USER);
  }
}

export const storage = new Storage();

