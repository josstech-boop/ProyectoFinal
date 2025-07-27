const API_BASE_URL = 'http://localhost:5000/api';

export const authService = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email, password })
        });
        return response.json();
    },
    getProfile: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }
};

export const userService = {
    getUsers: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/usuarios`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },
    createUser: async (userData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        return response.json();
    },
    updateUser: async (userId, userData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/usuarios/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        return response.json();
    },
    deleteUser: async (userId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/usuarios/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }
};