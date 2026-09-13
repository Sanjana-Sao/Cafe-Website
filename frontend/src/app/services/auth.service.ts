import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export type UserRole = 'staff' | 'manager';

export interface AuthUser {
  user_id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string, role: UserRole): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/signup`, { email, password, role }).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  login(email: string, password: string, role: UserRole): Observable<AuthResponse> {
    const body = new HttpParams()
      .set('username', email)
      .set('password', password)
      .set('scope', role);
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
  }

  get currentUser(): AuthUser | null {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) as AuthUser : null;
  }

  get currentRole(): UserRole | null {
    return this.currentUser?.role || null;
  }

  isManager(): boolean {
    return this.currentRole === 'manager';
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
  }
}
