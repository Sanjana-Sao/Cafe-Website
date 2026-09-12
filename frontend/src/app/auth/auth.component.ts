import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  mode: 'login' | 'signup' = 'login';
  role: UserRole = 'staff';
  email = '';
  password = '';
  confirmPassword = '';
  rememberMe = false;
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute
  ) {
    route.data.subscribe((data) => {
      this.mode = data['mode'] || 'login';
    });
  }

  submit(): void {
    this.error = '';
    if (this.mode === 'signup' && this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.loading = true;
    const request = this.mode === 'login'
      ? this.authService.login(this.email, this.password, this.role)
      : this.authService.signup(this.email, this.password, this.role);

    request.subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate([response.user.role === 'manager' ? '/sales' : '/pending-approval']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.detail || 'Unable to complete authentication.';
      }
    });
  }

  switchMode(): void {
    this.router.navigate([this.mode === 'login' ? '/signup' : '/login']);
  }
}
