import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('access_token');
    if (!token || !request.url.startsWith(API_BASE_URL)) {
      return next.handle(request);
    }
    return next.handle(request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }));
  }
}
