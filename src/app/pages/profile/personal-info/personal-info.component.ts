import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/authservice/auth.service';
import { UserService } from '../../../services/auth/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-personal-info',
  imports: [CommonModule , FormsModule , RouterModule],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent {
  userData: any = {}; 
  editData: any = {};
 toastMessage: string = '';
 toastType: 'success' | 'error' = 'success';
constructor(private userService: UserService ,private authService : AuthService ,private router: Router) {}

 ngOnInit(): void {
    this.userService.getUserData().subscribe({
      next: (data: any) => {
        if (data) {
          this.userData = data;
          this.editData = {
            firstName: data.firstName,
            lastName: data.lastName
          };
        }
      },
      error: (err) => {
        console.error('Error loading user data', err);
        this.router.navigate(['/error'], { replaceUrl: true }); 
      }
    });
  }

fetchUserData() {
    const userId = localStorage.getItem('UserId') || '';
    this.authService.getuser(userId).subscribe({
      next: (data: any) => {
        this.userData = data;
        this.editData = {
          firstName: data.firstName,
          lastName: data.lastName
        };
      },
      error: (err) => {
        console.error('Error fetching user', err);
        this.router.navigate(['/error'], { replaceUrl: true }); 
      }
    });
  }

updateUserInfo() {
  const userId = localStorage.getItem('UserId') || '';
  const updatedFields: any = {};
  if (
    this.editData.firstName &&  this.editData.firstName !== this.userData.firstName) {
    updatedFields.firstName = this.editData.firstName;
  }
  if (
    this.editData.lastName && this.editData.lastName !== this.userData.lastName) {
    updatedFields.lastName = this.editData.lastName;
  }

  if (Object.keys(updatedFields).length === 0) {
    this.showToast('Please update at least one field.', 'error');
    return;
  }

  this.authService.updateUser(userId, updatedFields).subscribe(
    () => {
      if (updatedFields.firstName) {
        this.userData.firstName = updatedFields.firstName;
      }
      if (updatedFields.lastName) {
        this.userData.lastName = updatedFields.lastName;
      }

      this.showToast('Updated Successfully!', 'success');
    },
    (error) => {
      this.showToast('Failed to update. Try again.', 'error');
       this.router.navigate(['/error'], { replaceUrl: true }); 
    }
  );
}

isSomethingChanged(): boolean {
  return (
    (this.editData.firstName && this.editData.firstName !== this.userData.firstName) ||
    (this.editData.lastName && this.editData.lastName !== this.userData.lastName)
  );
}

hasInvalidInputs(): boolean {
  const pattern = /^[A-Za-z][A-Za-z0-9\-]{2,29}$/;

  return (
    (this.editData.firstName && !pattern.test(this.editData.firstName)) ||
    (this.editData.lastName && !pattern.test(this.editData.lastName))
  );
}
showToast(message: string, type: 'success' | 'error') {
  this.toastMessage = message;
  this.toastType = type;

  setTimeout(() => {
    this.toastMessage = '';
  }, 3000);
}
}
