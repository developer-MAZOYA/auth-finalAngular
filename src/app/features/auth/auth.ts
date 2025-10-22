import { Injectable, signal, Inject, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9090/auth';
  private isBrowser: boolean;
  private router = inject(Router);
  private http = inject(HttpClient);

  // Signals for state management
  token = signal<string | null>(null);
  user = signal<User | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (this.isBrowser) {
      const storedToken = localStorage.getItem('bearerToken');
      const storedUser = localStorage.getItem('userData');

      if (storedToken) {
        this.token.set(storedToken);
        if (storedUser) {
          try {
            this.user.set(JSON.parse(storedUser));
          } catch (e) {
            console.error('Error parsing user data:', e);
            this.clearAuthData();
          }
        }
      }
    }
  }

  register(userData: RegisterData): Observable<any> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        this.isLoading.set(false);
        if (response.token) {
          this.handleAuthentication(response.token, response.user);
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        this.error.set(error.error?.message || 'Registration failed');
        return of(null);
      })
    );
  }

  login(credentials: LoginCredentials): Observable<any> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.isLoading.set(false);
        if (response.token) {
          this.handleAuthentication(response.token, response.user);
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        this.error.set(error.error?.message || 'Login failed');
        return of(null);
      })
    );
  }

  private handleAuthentication(token: string, userData: User): void {
    this.token.set(token);
    this.user.set(userData);

    if (this.isBrowser) {
      localStorage.setItem('bearerToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }

  logout(): void {
    this.token.set(null);
    this.user.set(null);
    this.error.set(null);

    if (this.isBrowser) {
      localStorage.removeItem('bearerToken');
      localStorage.removeItem('userData');
    }

    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  getCurrentUser(): User | null {
    return this.user();
  }

  clearError(): void {
    this.error.set(null);
  }

  private clearAuthData = () => {
    return this.http.post<any>(`${this.apiUrl}/logout`, null).pipe()
  }
}
