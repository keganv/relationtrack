import { useCallback, useEffect, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import AuthContext from "../contexts/AuthContext";
import { LoginFields, NewPasswordFields } from "../types/AuthTypes.ts";
import User from "../types/User.ts";
import useGlobalContext from "../hooks/useGlobalContext.ts";

type AuthProviderProps = { children: ReactNode; }

const sessionUser: User | null = localStorage.getItem('rtud') ? JSON.parse(localStorage.getItem('rtud') ?? '') : null;

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { doLogout, handleError, setStatus } = useGlobalContext();
  const [user, setUser] = useState(sessionUser);
  const [errors, setErrors] = useState({}); // Used for form and API validation errors
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && rememberMe) {
      const now = new Date().getTime();
      const userData = { ...user, expiration: now + 7200000 }; // 2 hours
      localStorage.setItem('rtud', JSON.stringify(userData));
    }
  }, [user, rememberMe]);

  const csrf = () => axios.get('/sanctum/csrf-cookie');

  const getUser = async () => {
    try {
      const { data } = await axios.get('/api/user');
      setUser(data);
    } catch (e) {
      handleError(e, setErrors);
    }
  };

  const login = useCallback(async (data: LoginFields) => {
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      await csrf();
      await axios.post('/login', data);
      await getUser();
      navigate('/dashboard');
      setStatus({ type: 'success', message: 'Successfully Logged In!' });
      setRememberMe(data.remember ?? false);
    } catch (e) {
      handleError(e, setErrors);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [setStatus, getUser, navigate, handleError]);

  const register = async ({ ...data }) => {
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      await csrf();
      await axios.post('/register', data);
      await getUser();
      navigate('/dashboard');
      setStatus({ type: 'success', message: 'Successfully Logged In!' });
    } catch (e) {
      handleError(e, setErrors);
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
      setStatus({ type: 'success', message: response.data?.status });
    } catch (e) {
      handleError(e, setErrors);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }

  const newPassword = async (data: NewPasswordFields) => {
    setErrors({});
    setLoading(true);
    setStatus(null);
    try {
      const response = await axios.post('/reset-password', data);
      setStatus({ type: 'success', message: response.data?.status });
      navigate('/login');
    } catch (e) {
      handleError(e, setErrors);
    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  const sendEmailVerificationLink = async () => {
    setErrors({})
    setLoading(true)
    setStatus(null)
    try {
      const response = await axios.post('/email/verification-notification');
      setStatus({ type: 'success', message: response.data?.status });
    } catch (e) {
      handleError(e, setErrors);
    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  const logout = useCallback(async () => {
    try {
      setUser(null);
      navigate('/');
      localStorage.removeItem('rtud');
      await axios.post('/logout');
      document.cookie = "XSRF-TOKEN=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"; // Remove XSRF-TOKEN
    } catch (e) {
      handleError(e, setErrors);
    }
  }, [navigate, handleError]);

  const setProfileImage = async (image: File) => {
    setStatus(null);
    try {
      const formData = new FormData();
      const url = "/api/update-profile-image";
      formData.append('profile_image', image as File);
      const response = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await getUser();
      setStatus({ type: 'success', message: response.data.message });
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (doLogout) {
      logout();
    }
  }, [doLogout, logout]);

  return (
    <AuthContext.Provider value={{
      errors, user, login, register, logout, loading,
      sendPasswordResetLink, newPassword, sendEmailVerificationLink, setProfileImage
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
