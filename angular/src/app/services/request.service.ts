import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { inject } from "@angular/core";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

/*
Add Authorization Bearer <token> to request header
*/
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(SsrCookieService);

  if (!cookieService.check('token')) {
    return next(req)
  }

  const authToken = cookieService.get('token');
  // Add the authorization header
  const authRequest = req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + authToken
    }
  });

  // Should handle error here?
  return next(authRequest).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          console.error('Unauthorized request:', err);
        } else {
          console.error('HTTP error:', err);
        }
      } else {
        console.error('An error occurred:', err);
      }
      // Re-throw the error to propagate it further
      return throwError(() => err);
    })
  );
};



// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//
//   constructor(private cookieService: SsrCookieService) { }
//
//   intercept(req: HttpRequest<any>,
//             next: HttpHandler): Observable<HttpEvent<any>> {
//
//     let token = '';
//
//     if (this.cookieService.check('token')) {
//       token = this.cookieService.get('token');
//     } else {
//       token = '';
//     }
//
//     if (token) {
//       const cloned = req.clone({
//         headers: req.headers.set("Authorization", "Bearer " + token)
//       });
//
//       return next.handle(cloned);
//     }
//     else {
//       return next.handle(req);
//     }
//   }
// }
