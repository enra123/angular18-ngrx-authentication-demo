import { createAction, props } from '@ngrx/store';
import { User } from "@app/models/auth.model";

export const login = createAction(
  '[Auth] User Login',
  props<{ email: string, password: string }>()
);

export const register = createAction(
  '[Auth] User Register',
  props<{ email: string, password: string }>()
);

export const loginCheck = createAction('[Auth] Login Check');

export const logout = createAction('[Auth] User Logout');

export const setToken = createAction(
  '[Auth] Set Token',
  props<{ token: string }>()
);

export const setUser = createAction(
  '[Auth] Set User',
  props<{ user: User }>()
);

export const setError = createAction(
  '[Auth] Set Error',
  props<{ error: string }>()
);

export const removeError = createAction('[Auth] Remove Error');

