import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User|null>(null);
  private _token = signal<string|null>(null);

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus()
  });

  public authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if ( this._user() ) return 'authenticated';

    return 'not-authenticated';
  });

  user = computed<User|null>(() => this._user());

  token = computed<string|null>(() => this._token());

  // Función de login
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email,
      password
    }).pipe(
      map((response) => this.handleSucessAuth(response)),
      catchError(( error: any) => this.handleErrorAuth(error))
    )
  }

  checkStatus(): Observable<boolean> {

    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // }
    }).pipe(
      map((response) => this.handleSucessAuth(response)),
      catchError(( error: any) => this.handleErrorAuth(error))
    )
  }


  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    // TODO: Revertir
    // localStorage.removeItem('token');
  }

  private handleSucessAuth({ token, user }: AuthResponse) {
    this._user.set(user);
    this._token.set(token);
    this._authStatus.set('authenticated');
    localStorage.setItem('token', token);

    return true;
  }

  private handleErrorAuth(error: any): Observable<boolean> {
    this.logout();
    return of(false);
  }


}
