import { inject } from '@angular/core';
import { selectHasPermission } from "@app/store/auth/login.selectors";
import { Store } from "@ngrx/store";
import { AuthState } from "@app/models/auth.model";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

export function hasPermissionGuard(permission: string) {
  return function () {
    const store = inject(Store<AuthState>);
    const router = inject(Router);
    return store.select(selectHasPermission(permission)).pipe(
      map((hasPermission) => hasPermission ? true : router.parseUrl('/login'))
    );
  };
}
