import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<string>(`${environment.apiUrl}/auth/login`, { email, password });
  }

  register(email: string, password: string) {
    return this.http.post<string>(`${environment.apiUrl}/auth/register`, { email, password });
  }

  getUserProfile() {
    return this.http.get<User>(`${environment.apiUrl}/auth/user`);
  }

}
