import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import axios from '../lib/axios';
import AuthContext from '../contexts/AuthContext';

type AuthProviderProps = {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const sessionUser = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') ?? '') : null;
    const [user, setUser] = useState(sessionUser);
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<string|null>(null)
    const [statusError, setStatusError] = useState<string|null>(null)
    const navigate = useNavigate();
    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const getUser = async () => {
        const { data } = await axios.get('/api/user')
        setUser(data);
        sessionStorage.setItem('user', JSON.stringify(data));
    }

    const login = async ({ ...data }) => {
        setErrors({});
        setLoading(true);
        setStatus(null);
        try {
            await csrf();
            await axios.post('/login', data);
            await getUser();
            navigate('/dashboard');
            setStatus('Successfully Logged In!');
        } catch (e) {
            handleError(e);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }

    const register = async ({ ...data }) => {
        setErrors({});
        setLoading(true);
        setStatus(null);
        try {
            await csrf();
            await axios.post('/register', data);
            await getUser();
            navigate('/dashboard');
            setStatus('Successfully Logged In!');
        } catch (e) {
            handleError(e);
        } finally {
            setTimeout(() => setLoading(false), 1000)
        }
    }

    const sendPasswordResetLink = async ({ ...data }) => {
        setErrors({})
        setLoading(true)
        setStatus(null)
        try {
            await csrf();
            const response = await axios.post('/forgot-password', data);
            setStatus(response.data?.status);
        } catch (e) {
            handleError(e);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }

    const newPassword = async ({ ...data }) => {
        setErrors({});
        setLoading(true);
        setStatus(null);
        try {
            await csrf();
            const response = await axios.post('/reset-password', data);
            setStatus(response.data?.status);
            navigate('/login');
        } catch (e) {
            handleError(e);
        } finally {
            setTimeout(() => setLoading(false), 1000)
        }
    }

    const sendEmailVerificationLink = async () => {
        setErrors({})
        setLoading(true)
        setStatus(null)
        try {
            await csrf()
            const response = await axios.post('/email/verification-notification')
            setStatus(response.data?.status)
        } catch (e) {
            handleError(e);
        } finally {
            setTimeout(() => setLoading(false), 2000)
        }
    }

    const logout = async () => {
        try {
            await axios.post('/logout');
            setUser(null);
            sessionStorage.removeItem('user');
            navigate('/login');
        } catch (e) {
            handleError(e);
        }
    }

    const setProfileImage = async (image: File) => {
        setStatus(null);
        try {
            const formData = new FormData();
            const url = '/api/update-profile-image';
            formData.append('profile_image', image as File);
            const response = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            await getUser();
            setStatus(response.data.message);
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (e: AxiosError | unknown) => {
        if (e instanceof AxiosError) {
            setErrors(e.response?.data.errors || {error: [e.message]});
            setStatusError(e.response?.data.message || e.message);
        }
        console.error(e);
    }

    return (
      <AuthContext.Provider value={{
        errors, user, login, register, logout, loading, status, setStatus, statusError, setStatusError,
        sendPasswordResetLink, newPassword, sendEmailVerificationLink, setProfileImage
      }}>
          {children}
      </AuthContext.Provider>
    );
}

export default AuthProvider;
