import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from "@app/models/auth.model";

export const authFeature = createFeatureSelector<AuthState>("auth");

export const selectToken = createSelector(
  authFeature,
  (state) => state.token
);

export const selectIsAuthenticated = createSelector(
  authFeature,
  (state) => !!state.token
);

export const selectUser = createSelector(
  authFeature,
  (state) => state.user
);

export const selectPermissions = createSelector(
  selectUser,
  (user) => user?.permissions ?? []
);

export const selectHasPermission = (permission: string) => createSelector(
  selectPermissions, (permissions) => permissions.includes(permission)
);

export const selectError = createSelector(
  authFeature,
  (state) => state.error
);

export const selectIsLoading = createSelector(
  authFeature,
  (state) => state.isLoading
);
