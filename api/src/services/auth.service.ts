export class AuthService {
  async register(email: string, password: string, name: string) {
    return {
      user: { id: 1, email, name, avatar: '' },
      token: 'mock_jwt_token_register_' + Date.now(),
      refresh_token: 'mock_refresh_token_' + Date.now(),
    };
  }

  async login(email: string, password: string) {
    return {
      user: { id: 1, email, name: 'MockUser', avatar: '' },
      token: 'mock_jwt_token_login_' + Date.now(),
      refresh_token: 'mock_refresh_token_' + Date.now(),
    };
  }

  async refresh(refreshToken: string) {
    return {
      token: 'mock_jwt_token_refresh_' + Date.now(),
      refresh_token: 'mock_refresh_token_' + Date.now(),
    };
  }
}
