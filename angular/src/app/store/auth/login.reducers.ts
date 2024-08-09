import { createReducer, on } from '@ngrx/store';
import { login, logout, setToken, setUser, setError, register, removeError } from '@app/store/auth/login.actions';
import { AuthState } from "@app/models/auth.model";

export const authFeatureKey = 'auth';

export const initialState: AuthState = {
  token: '',
  error: '',
  user: null,
  isLoading: true,
};

export const authReducer = createReducer(initialState,
  on(login, state => ({ ...state, isLoading: true })),
  on(register, state => ({ ...state, isLoading: true })),
  on(setToken, (state, { token }) => ({ ...state, token, isLoading: true })),
  on(setUser, (state, { user }) => ({ ...state, user, isLoading: false })),
  on(logout, (state) => ({ ...state, token: '', user: null, isLoading: false })),
  on(setError, (state, { error }) => ({ ...state, error, isLoading: false })),
  on(removeError, (state) => ({ ...state, error: ''})),
);
