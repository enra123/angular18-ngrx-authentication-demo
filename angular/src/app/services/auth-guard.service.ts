import { inject } from '@angular/core';
import { Router, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { selectIsAuthenticated } from "@app/store/auth/login.selectors";
import { AuthState } from "@app/models/auth.model";

export function authGuard(negate=false) {
  return function (state: RouterStateSnapshot) {
    const store = inject(Store<AuthState>);
    const router = inject(Router);
    return store.select(selectIsAuthenticated).pipe(
      map((isAuth) => {
        if (negate) {
          // should not be logged in. e.g. login page
          return !isAuth ? true : router.parseUrl('/');
        } else {
          // should be logged in. e.g. dashboard
          return isAuth ? true : router.parseUrl('/login');
        }
      })
    );
  };
}


