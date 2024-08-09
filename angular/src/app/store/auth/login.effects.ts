import { inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  login,
  logout,
  setToken,
  setUser,
  setError,
  register,
  loginCheck
} from '@app/store/auth/login.actions';
import { AuthService } from '@app/services/auth.service';
import { Router } from "@angular/router";
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable()
export class AuthEffects {
  actions$: Actions = inject(Actions);
  router: Router = inject(Router);
  location: Location = inject(Location);
  authService: AuthService = inject(AuthService);
  cookieService: SsrCookieService = inject(SsrCookieService);

  // init$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ROOT_EFFECTS_INIT),
  //     tap(()=>console.log("initiate store")),
  //     exhaustMap(() => {
  //       return of(loginCheck());
  //     })
  //   )
  // );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(action =>
        this.authService.login(action.email, action.password).pipe(
          exhaustMap((token) => {
            this.cookieService.set('token', token);
            return of(loginCheck())
          }),
          catchError(err => of(setError({ error: err.error })))
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      exhaustMap(action =>
        this.authService.register(action.email, action.password).pipe(
          exhaustMap(token => {
            this.cookieService.set('token', token);
            return of(loginCheck())
          }),
          catchError(err => {
            return of(setError({ error: err.error }))
          })
        )
      )
    )
  );

  loginCheck$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginCheck),
        exhaustMap(() => {
          if (this.cookieService.check('token')) {
            return of(setToken({ token: this.cookieService.get('token') }))
          } else {
            return of(logout())
          }
        })
      )
  );

  // loginSuccess$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(loginSuccess),
  //       tap(() => this.router.navigateByUrl('/')),
  //       exhaustMap(() => of(loginCheck())),
  //     )
  // );

  loginComplete$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setToken),
        exhaustMap(action =>
          this.authService.getUserProfile().pipe(
            map(user => setUser({ user: user })),
            tap(() => {
              if (this.location.path().includes('login') || this.location.path().includes('register')) {
                this.router.navigateByUrl('/dashboard');
              }
            }),
            catchError(err => of(logout()))
          )
        )
      )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        this.cookieService.delete('token');
        if (this.location.path().includes('login') || this.location.path().includes('register')) return;
        this.router.navigateByUrl('/');
      }),
    ),
    { dispatch: false }
  );

}
