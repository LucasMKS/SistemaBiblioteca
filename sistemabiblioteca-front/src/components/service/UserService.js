import axios from "axios";

class UserService {
  static BASE_URL = "http://localhost:8080"

  static async login(email, password) {
    try {
      const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { email, password })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async register(userData) {
    try {
      const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData)
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getAllUsers(token) {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getYourProfile(token) {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getUserById(userId, token) {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async deleteUser(userId, token) {
    try {
      const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async updateUser(userId, userData, token) {
    try {
      const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async userUpdateEmail(userId, userData, token) {
    try {
      const response = await axios.put(`${UserService.BASE_URL}/adminuser/update/${userId}`, userData,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  // Book Services
  static async getAllBooks() {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/book/get-all-books`)
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async updateBook(bookIsbn, bookData, token) {
    try {
      const response = await axios.put(`${UserService.BASE_URL}/admin/update-book/${bookIsbn}`, bookData,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async deleteBooks(bookIsbn, token) {
    try {
      const response = await axios.delete(`${UserService.BASE_URL}/admin/delete-book/${bookIsbn}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getBookByIsbn(bookIsbn) {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/book/getBook/${bookIsbn}`)
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async registerBook(bookData, token) {
    try {
      const response = await axios.post(`${UserService.BASE_URL}/admin/register-book`, bookData,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  // Loan Services
  static async registerLoan(loankData) {
    try {
      const response = await axios.post(`${UserService.BASE_URL}/book/register-loan`, loankData)
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getLoanByMatricula(matricula) {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/book/getLoan/${matricula}`)
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async deleteLoan(matricula, bookIsbn, token) {
    try {
      const response = await axios.delete(`${UserService.BASE_URL}/admin/delete-loan/${matricula}/${bookIsbn}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        })
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  /**AUTHENTICATION CHECKER */
  static logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  static isAuthenticated() {
    const token = localStorage.getItem('token')
    return !!token
  }

  static isAdmin() {
    const role = localStorage.getItem('role')
    return role === 'ADMIN'
  }

  static isUser() {
    const role = localStorage.getItem('role')
    return role === 'USER'
  }

  static adminOnly() {
    return this.isAuthenticated() && this.isAdmin();
  }
}

export default UserService;
