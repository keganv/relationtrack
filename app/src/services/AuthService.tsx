import { ReactNode, createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '../lib/axios';

type AuthProviderProps = {
    children: ReactNode;
}

export type ProfileImage = {
    created_at: string,
    extension: string,
    id: number,
    name: string,
    path: string,
    relationship_id: number | null,
    size: number
    updated_at: string,
    user_id: string
}

export type User = {
    name?: string,
    username?: string,
    email?: string,
    created_at?: string,
    id?: string,
    updated_at?: string,
    email_verified_at?: string,
    profile_image?: ProfileImage
}

type Errors = {
    name?: string[];
    email?: string[];
    password?: string[];
    username?: string[];
    password_confirmation?: string[];
    terms?: string[];
}

type LoginParams = { email: string, password: string }

type RegisterParams = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    username: string;
    terms: string;
}

type NewPasswordParams = {
    email: string | null;
    token: string | undefined;
    password: string;
    password_confirmation: string;
}

export interface AuthContextValues {
    csrf: () => Promise<AxiosResponse<unknown>>,
    errors: Errors,
    user: User | null,
    login: (data: LoginParams) => Promise<void>,
    register: (data: RegisterParams) => Promise<void>,
    logout: () => Promise<void>,
    loading: boolean,
    status: string | null,
    setStatus: React.Dispatch<React.SetStateAction<string | null>>,
    statusError: string | null,
    setStatusError: React.Dispatch<React.SetStateAction<string | null>>,
    sendPasswordResetLink: (data: { email: string }) => Promise<void>,
    newPassword: (data: NewPasswordParams) => Promise<void>,
    sendEmailVerificationLink: () => Promise<void>,
    setProfileImage: (image: File) => Promise<void>,
}

export const AuthContext = createContext<AuthContextValues>({} as AuthContextValues)

export function AuthProvider({ children }: AuthProviderProps) {
    const sessionUser = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') ?? '') : null;
    const [user, setUser] = useState(sessionUser);
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<string|null>(null)
    const [statusError, setStatusError] = useState<string|null>(null)
    const navigate = useNavigate();
    const csrf = () => axios.get('/sanctum/csrf-cookie')

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
            setStatus('Successfully Logged In!')
        } catch (e) {
            if (typeof e === 'object' && e !== null && 'response' in e) {
                console.warn((e as { response: { data: unknown } }).response.data)
                setErrors((e as { response: { data: { errors: [] } } }).response.data.errors)
            } else {
                console.warn(e)
            }
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }

    const register = async ({ ...data }) => {
        setErrors({})
        setLoading(true)
        try {
            await csrf()
            await axios.post('/register', data)
            await getUser()
        } catch (e) {
            if (typeof e === 'object' && e !== null && 'response' in e) {
                console.warn((e as { response: { data: unknown } }).response.data)
                setErrors((e as { response: { data: { errors: [] } } }).response.data.errors)
            } else {
                console.warn(e)
            }
        } finally {
            setTimeout(() => setLoading(false), 2000)
        }
    }

    const sendPasswordResetLink = async ({ ...data }) => {
        setErrors({})
        setLoading(true)
        setStatus(null)
        try {
            await csrf()
            const response = await axios.post('/forgot-password', data)
            setStatus(response.data?.status)
        } catch (e) {
            if (typeof e === 'object' && e !== null && 'response' in e) {
                console.warn((e as { response: { data: unknown } }).response.data)
                setErrors((e as { response: { data: { errors: [] } } }).response.data.errors)
            } else {
                console.warn(e)
            }
        } finally {
            setTimeout(() => setLoading(false), 2000)
        }
    }


    const newPassword = async ({ ...data }) => {
        setErrors({})
        setLoading(true)
        setStatus(null)
        try {
            await csrf()
            const response = await axios.post('/reset-password', data)
            setStatus(response.data?.status)
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (e) {
            if (typeof e === 'object' && e !== null && 'response' in e) {
                console.warn((e as { response: { data: unknown } }).response.data)
                setErrors((e as { response: { data: { errors: [] } } }).response.data.errors)
            } else {
                console.warn(e)
            }
        } finally {
            setTimeout(() => setLoading(false), 2000)
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
            if (typeof e === 'object' && e !== null && 'response' in e) {
                console.warn((e as { response: { data: unknown } }).response.data)
                setErrors((e as { response: { data: { errors: [] } } }).response.data.errors)
            } else {
                console.warn(e)
            }
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
            console.warn(e);
            if (e instanceof AxiosError) {
                const status = e.response?.status;
                if (status === 401 || status === 419) {
                    setUser(null);
                    sessionStorage.removeItem('user');
                }
            }
        }
    }

    const setProfileImage = async (image: File) => {
        setStatus(null);
        try {
            const formData = new FormData();
            const url = '/api/update-profile-image';
            formData.append('profile_image', image as File);
            const response = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            if (response) {
                await getUser();
                setStatus(response.data.message);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error);
                setStatusError(error.response?.data.message);
            }
        }
    };

    return (
      <AuthContext.Provider value={{
        csrf, errors, user, login, register, logout, loading, status, setStatus, statusError, setStatusError,
        sendPasswordResetLink, newPassword, sendEmailVerificationLink, setProfileImage
      }}>
          {children}
      </AuthContext.Provider>
    );
}
