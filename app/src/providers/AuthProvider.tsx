import type { AxiosError } from 'axios';
import { type ReactNode, useCallback, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router';

import AuthContext from '../contexts/AuthContext';
import useGlobalContext from '../hooks/useGlobalContext';
import axios from '../lib/axios';
import { authReducer } from '../reducers/authReducer';
import type { AuthApiErrors, AuthState, LoginFields, NewPasswordFields } from '../types/Auth';
import type { User, UserFormData } from '../types/User';

const defaultAuthState: AuthState = {
  authenticated: false,
  checkingAuth: true, // Default to true for initial page loads
  doAuthCheck: true,
  errors: null, // Used for form and API validation errors
  loading: false,
  user: null
};

type AuthProviderProps = { children: ReactNode; }

const AuthProvider = ({children}: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, defaultAuthState);
  const {doLogout, handleError, setStatus} = useGlobalContext();
  const navigate = useNavigate();

  const csrf = () => axios.get('/api/sanctum/csrf-cookie');

  const dispatchErrors = (errors: AuthApiErrors) => {
    dispatch({ type: 'SET_ERRORS', payload: errors });
  };

  const getUser = useCallback(async () => {
    try {
      const {data} = await axios.get('/api/user');
      dispatch({ type: 'SET_USER', payload: data });
    } catch (e) {
      handleError(e, dispatchErrors);
    }
  }, [handleError]);

  const saveUser = useCallback(async (userFormData: UserFormData): Promise<User | AxiosError | void> => {
    if (!state.user) return;

    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH'); // Needed for Laravel API update route

      for (const key in userFormData) {
        if (key === 'profile_image') {
          formData.append('profile_image', userFormData.profile_image as File);
          continue;
        }

        formData.append(key, userFormData[key as keyof UserFormData] as string);
      }

      const { data } = await axios({
        url: `/api/users/${state.user.id}`,
        data: formData,
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      dispatch({ type: 'SET_USER', payload: data });
      setStatus({ type: 'success', message: 'Successfully updated user!' });

      return data;
    } catch (e) {
      handleError(e, dispatchErrors);
      return e as AxiosError;
    }
  }, [handleError, setStatus, state.user]);

  const updateUserField = useCallback(<K extends keyof User>(field: K, value: User[K]) => {
    const updatedUser = state.user ? { ...state.user, [field]: value } : null;
    dispatch({ type: 'SET_USER', payload: updatedUser });
  }, [state.user, dispatch]);

  const login = useCallback(async (data: LoginFields) => {
    try {
      await csrf(); // DO NOT REMOVE - Must receive/set CSRF Cookie
      const response = await axios.post('/api/login', data);
      response?.data?.user ? dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user }) : await getUser();
      navigate('/dashboard');
      setStatus({type: 'success', message: 'Successfully Logged In!'});
    } catch (e) {
      handleError(e, dispatchErrors);
    }
  }, [navigate, setStatus, getUser, handleError]);

  const register = async ({...data}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await csrf();
      const response = await axios.post('/api/register', data);
      navigate('/'); // Send them to the home page, they must verify their email first
      setStatus({ type: 'success', message: response.data?.message });
    } catch (e) {
      handleError(e, dispatchErrors);
    } finally {
      setTimeout(() => dispatch({ type: 'SET_LOADING', payload: false }), 1000);
    }
  }

  const sendPasswordResetLink = async ({...data}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await axios.post('/api/forgot-password', data);
      setStatus({ type: 'success', message: response.data?.message });
    } catch (e) {
      handleError(e, dispatchErrors);
    } finally {
      setTimeout(() => dispatch({ type: 'SET_LOADING', payload: false }), 1000);
    }
  }

  const newPassword = async (data: NewPasswordFields) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await axios.post('/api/reset-password', data);
      setStatus({ type: 'success', message: response.data?.message });
      navigate('/login');
    } catch (e) {
      handleError(e, dispatchErrors);
    } finally {
      setTimeout(() => dispatch({ type: 'SET_LOADING', payload: false }), 1000)
    }
  }

  const sendEmailVerificationLink = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await axios.post('/api/email/verification-notification');
      setStatus({ type: 'success', message: response.data?.message });
    } catch (e) {
      handleError(e, dispatchErrors);
    } finally {
      setTimeout(() => dispatch({ type: 'SET_LOADING', payload: false }), 1000)
    }
  }

  /**
   * If clearRemember is passed as <boolean> true, then send remember as false to the API
   */
  const logout = useCallback(async (clearRemember?: boolean) => {
    try {
      await axios.post('/api/logout', null, clearRemember ? { params: { remember: false } } : undefined);
      dispatch({type: 'LOGOUT'});
      document.cookie = "XSRF-TOKEN=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"; // Remove XSRF-TOKEN cookie
      navigate('/');
      setStatus({ type: 'success', message: 'Successfully Logged Out!'});
    } catch (e) {
      handleError(e, dispatchErrors);
    }
  }, [navigate, setStatus, handleError]);

  /**
   * The API "api/authentication" route must send back the `authenticated` key with a boolean value
   */
  const checkAuthenticated = useCallback(async () => {
    dispatch({ type: 'SET_CHECKING_AUTH', payload: true });
    await csrf();
    const response = await axios.post('/api/authenticated');
    const auth = response?.data?.authenticated;
    dispatch({ type: 'SET_AUTHENTICATED', payload: auth ?? false });
  }, []);

  useEffect(() => {
    if (!state.authenticated && state.doAuthCheck) {
      checkAuthenticated();
    }
    if (!state.user && state.authenticated) {
      getUser();
    }
  }, [state.authenticated, state.doAuthCheck, state.user, getUser, checkAuthenticated]);

  useEffect(() => {
    if (doLogout) {
      logout();
    }
  }, [doLogout, logout]);

  return (
    <AuthContext value={{
      ...state,
      login, register, logout, sendPasswordResetLink, newPassword,
      sendEmailVerificationLink, updateUserField, saveUser
    }}>
      {children}
    </AuthContext>
  );
}

export default AuthProvider;
