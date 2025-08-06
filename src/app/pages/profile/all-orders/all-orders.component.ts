import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/auth/user.service';

@Component({
  selector: 'app-all-orders',
  imports: [CommonModule , RouterModule],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css'
})
export class AllOrdersComponent {
 userData: any = {}; 
 isLoading = true;
constructor(private userService: UserService ,private router: Router) {}

  ngOnInit(): void {
    this.userService.getUserData().subscribe({
      next: (data: any) => {
        if (data) {
          this.userData = data;
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load user data', err);
        this.isLoading = false;
        this.router.navigate(['/error'], { replaceUrl: true }); 
      }
    });
  }
}
