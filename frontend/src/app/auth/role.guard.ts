import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const roles = route.data['roles'] as UserRole[] | undefined;
    const token = localStorage.getItem('access_token');
    if (!token || !this.authService.currentRole) {
      return this.router.parseUrl('/login');
    }
    const role = this.authService.currentRole;
    return !roles || (role !== null && roles.includes(role))
      ? true
      : this.router.parseUrl('/menu');
  }
}
