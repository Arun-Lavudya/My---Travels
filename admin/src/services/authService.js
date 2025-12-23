import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1/auth';

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export default {
    login,
    logout,
    getCurrentUser
};
