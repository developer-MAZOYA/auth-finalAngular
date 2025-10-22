import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="card">
        <h2>Create Account</h2>
        <p class="subtitle">Join us today</p>

        <div *ngIf="authService.error()" class="alert error">
          {{ authService.error() }}
        </div>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="name"
              name="name"
              placeholder="Enter your full name"
              [disabled]="authService.isLoading()"
              class="form-control">
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              placeholder="Enter your email"
              required
              email
              [disabled]="authService.isLoading()"
              class="form-control">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Enter your password"
              required
              minlength="6"
              [disabled]="authService.isLoading()"
              class="form-control">
          </div>

          <button
            type="submit"
            [disabled]="!registerForm.valid || authService.isLoading()"
            class="btn btn-primary btn-block">
            <span *ngIf="!authService.isLoading()">Create Account</span>
            <span *ngIf="authService.isLoading()">Creating Account...</span>
          </button>
        </form>

        <div class="footer">
          <p>Already have an account?
            <a routerLink="/login" (click)="clearError()" class="link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 0.5rem;
      color: #333;
      font-size: 1.8rem;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-control:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-block {
      width: 100%;
    }

    .alert {
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .error {
      background-color: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }

    .footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e1e5e9;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .link:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private router = inject(Router);
  private subscription?: Subscription;

  name = '';
  email = '';
  password = '';

  ngOnInit(): void {
    this.authService.clearError();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.subscription = this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe();
  }

  clearError(): void {
    this.authService.clearError();
  }
}
