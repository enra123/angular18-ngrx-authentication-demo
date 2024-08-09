import { ApplicationConfig, provideZoneChangeDetection, isDevMode, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { provideStore, provideState, Store } from '@ngrx/store';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { authFeatureKey, authReducer } from '@app/store/auth/login.reducers';
import { AuthEffects } from '@app/store/auth/login.effects';
import { authInterceptor} from "@app/services/request.service";
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { loginCheck } from "@app/store/auth/login.actions";
import { AuthState } from "@app/models/auth.model";
import { selectIsLoading } from "@app/store/auth/login.selectors";
import { skipWhile, take } from "rxjs";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideClientHydration(),
    provideStore({ [authFeatureKey]: authReducer }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true
    }),
    provideAnimationsAsync(),
    provideEffects(AuthEffects),
    provideState({ name: 'auth', reducer: authReducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    {
      provide: APP_INITIALIZER,
      useFactory: initApplication,
      deps: [Store],
      multi: true
    }
  ]
};

/*
Do loginCheck when app starts and wait for the completion before anything.
e.g. token check in cookie and fetching user data from server
 */
export function initApplication(store: Store<AuthState>): Function {
  return () => new Promise(resolve => {
    store.select(selectIsLoading)
      .pipe(
        skipWhile( isLoading => isLoading ),
        take(1))
      .subscribe( () => {
        resolve(true)
      } );
    store.dispatch(loginCheck());
  })
}
