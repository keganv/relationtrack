import type { AuthAction, AuthState } from '../types/Auth.ts';

export function authReducer(state: AuthState, action: AuthAction)
{
  switch (action.type) {
    case 'LOGIN_SUCCESS': {
      return {
        ...state,
        authenticated: true,
        doAuthCheck: true,
        errors: null,
        user: action.payload,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        authenticated: false,
        doAuthCheck: false,
        errors: null,
        user: null,
      };
    }
    case 'SET_AUTHENTICATED': {
      return {
        ...state,
        authenticated: action.payload,
        doAuthCheck: true, // Always reset to true
        checkingAuth: false,
      };
    }
    case 'SET_CHECKING_AUTH': {
      return {...state, checkingAuth: true};
    }
    case 'SET_LOADING': {
      return {...state, checkingAuth: true};
    }
    case 'SET_USER': {
      const hasUser: boolean = !!(action.payload && 'email' in action.payload);
      return {
        ...state,
        authenticated: hasUser,
        doAuthCheck: hasUser,
        user: action.payload,
        errors: null
      };
    }
    case 'SET_ERRORS': {
      return {...state, errors: action.payload};
    }
    default: {
      return state;
    }
  }
}
