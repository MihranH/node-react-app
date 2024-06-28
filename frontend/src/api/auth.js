import api from '.';

class Auth {
  static async getUser() {
    const user = await api.get('/users/me');
    return user.data;
  }

  static async register(data) {
    const result = await api.post('/register', data);
    return result.data;
  }

  static async login(data) {
    const result = await api.post('/login', data);
    return result.data;
  }

  static async upload(data) {
    const { photos, userId } = data;
    const result = await api.post('/upload', photos, {
      params: { userId },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return result.data;
  }
}

export default Auth;
