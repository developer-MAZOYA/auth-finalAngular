import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../auth/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  currentUser: User | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}
