import { useCallback, useEffect, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import axios from "../lib/axios";
import AuthContext from "../contexts/AuthContext";
import { LoginFields, Status } from "../types/AuthTypes.ts";
import User from "../types/User.ts";

type AuthProviderProps = {
  children: ReactNode;
}

function getSessionUser(): User | null {
  const now = new Date().getTime();
  const sessionUser = localStorage.getItem('rtud') ? JSON.parse(localStorage.getItem('rtud') ?? '') : null;
  
  // If it has been longer than 2 hours since the user logged in for "remember me users",
  // then remove the user from local storage.
  if (sessionUser && now > sessionUser.expiration) {
    localStorage.removeItem('rtud');
    
    return null;
  }

  return sessionUser;
}

const DISALLOWED_STATUS_MESSAGES = ['sql', 'connection', 'select', 'from', 'where'];
const sessionUser = getSessionUser();

const AuthProvider = ({children}: AuthProviderProps) => {
  const [user, setUser] = useState(sessionUser);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [rememberMe, setRememebMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && rememberMe) {
      console.log(rememberMe);
      const now = new Date().getTime();
      const userData = {...user, expiration: now + 7200000}; // 2 hours
      localStorage.setItem('rtud', JSON.stringify(userData));
    }
  }, [user, rememberMe]);

  const csrf = () => axios.get('/sanctum/csrf-cookie');

  const getUser = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/user');
      setUser(data);
    } catch (e) {
      handleError(e);
    }
  }, []);

  const login = async (data: LoginFields) => {
    console.log(data);
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      await csrf();
      await axios.post('/login', data);
      await getUser();
      navigate('/dashboard');
      setStatus({type: 'success', message: 'Successfully Logged In!'});
      setRememebMe(data.remember ?? false);
    } catch (e) {
      handleError(e);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }

  const register = async ({...data}) => {
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      await csrf();
      await axios.post('/register', data);
      await getUser();
      navigate('/dashboard');
      setStatus({type: 'success', message: 'Successfully Logged In!'});
    } catch (e) {
      handleError(e);
    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  const sendPasswordResetLink = async ({...data}) => {
    setErrors({})
    setLoading(true)
    setStatus(null)
    try {
      await csrf();
      const response = await axios.post('/forgot-password', data);
      setStatus({type: 'success', message: response.data?.status});
    } catch (e) {
      handleError(e);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }

  const newPassword = async ({...data}) => {
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      await csrf();
      const response = await axios.post('/reset-password', data);
      setStatus({type: 'success', message: response.data?.status});
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
      setStatus({type: 'success', message: response.data?.status})
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
      localStorage.removeItem('rtud');
      navigate('/');
    } catch (e) {
      handleError(e);
    }
  }

  const setProfileImage = async (image: File) => {
    setStatus(null);
    try {
      const formData = new FormData();
      const url = "/api/update-profile-image";
      formData.append('profile_image', image as File);
      const response = await axios.post(url, formData, {headers: {'Content-Type': 'multipart/form-data'}});
      await getUser();
      setStatus({type: 'success', message: response.data.message});
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (e: AxiosError | unknown) => {
    if (e instanceof AxiosError) {
      const message = e.response?.data.message || e.message;
      const allowMessage = !DISALLOWED_STATUS_MESSAGES.find(status => message.includes(status));
      setErrors(e.response?.data.errors || {error: [e.message]});
      setStatus({type: 'error', message: allowMessage ? message : 'Uh oh! Something went wrong.'});
    }
  }

  return (
    <AuthContext.Provider value={{
      errors, user, login, register, logout, loading, status,
      sendPasswordResetLink, newPassword, sendEmailVerificationLink, setProfileImage
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
