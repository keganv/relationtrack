import { useCallback, useEffect, ReactNode, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../lib/axios";
import AuthContext from "../contexts/AuthContext";
import { LoginFields, NewPasswordFields } from "../types/AuthTypes";
import useGlobalContext from "../hooks/useGlobalContext";

type AuthProviderProps = { children: ReactNode; }

const AuthProvider = ({children}: AuthProviderProps) => {
  const {doLogout, handleError, setStatus} = useGlobalContext();
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [doAuthCheck, setDoAuthCheck] = useState(true);
  const [errors, setErrors] = useState({}); // Used for form and API validation errors
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // Default to true for initial page loads
  const navigate = useNavigate();

  const csrf = () => axios.get('/api/sanctum/csrf-cookie');

  const getUser = useCallback(async () => {
    try {
      const {data} = await axios.get('/api/user');
      setUser(data);
    } catch (e) {
      handleError(e, setErrors);
    }
  }, [handleError]);

  const login = useCallback(async (data: LoginFields) => {
    try {
      await csrf();
      const response = await axios.post('/api/login', data);
      response.data.user ? setUser(response.data.user) : await getUser();
      setAuthenticated(true);
      setDoAuthCheck(true);
      navigate('/dashboard');
      setStatus({type: 'success', message: 'Successfully Logged In!'});
    } catch (e) {
      handleError(e, setErrors);
    }
  }, [getUser, setStatus, navigate, handleError]);

  const register = async ({...data}) => {
    setLoading(true);
    try {
      await csrf();
      const response = await axios.post('/api/register', data);
      navigate('/'); // Send them to the home page, they must verify their email first
      setStatus({ type: 'success', message: response.data?.message });
    } catch (e) {
      handleError(e, setErrors);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }

  const sendPasswordResetLink = async ({...data}) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/forgot-password', data);
      setStatus({ type: 'success', message: response.data?.message });
    } catch (e) {
      handleError(e, setErrors);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }

  const newPassword = async (data: NewPasswordFields) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/reset-password', data);
      setStatus({ type: 'success', message: response.data?.message });
      navigate('/login');
    } catch (e) {
      handleError(e, setErrors);
    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  const sendEmailVerificationLink = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/email/verification-notification');
      setStatus({ type: 'success', message: response.data?.message });
    } catch (e) {
      handleError(e, setErrors);
    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/logout');
      setDoAuthCheck(false);
      setAuthenticated(false);
      setUser(null);
      document.cookie = "XSRF-TOKEN=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"; // Remove XSRF-TOKEN cookie
      navigate('/');
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
      const response = await axios.post(url, formData, {headers: {'Content-Type': 'multipart/form-data'}});
      // await getUser();
      setStatus({ type: 'success', message: response.data?.message });
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * The API "api/authentication" route must send back the `authenticated` key with a boolean value
   */
  const checkAuthenticated = useCallback(async () => {
    setCheckingAuth(true);
    await csrf();
    const response = await axios.post('/api/authenticated');
    const auth = response.data?.authenticated;
    setAuthenticated(auth ?? false);
    setDoAuthCheck(true); // Always reset to true
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!authenticated && doAuthCheck) {
      console.log('checking auth.')
      checkAuthenticated();
    }
    if (!user && authenticated) {
      console.log('no user');
      getUser();
    }
  }, [user, getUser, authenticated, checkAuthenticated, doAuthCheck, navigate]);

  useEffect(() => {
    if (doLogout) {
      logout();
    }
  }, [doLogout, logout]);

  return (
    <AuthContext.Provider value={{
      authenticated, checkingAuth, doAuthCheck, errors, user, login, register, logout, loading,
      sendPasswordResetLink, newPassword, sendEmailVerificationLink, setProfileImage
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
