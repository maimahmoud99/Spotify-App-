import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../authservice/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

 canActivate(): boolean {
  const token = this.authService.getToken();
  const role = this.authService.getRole();


  if (token && token.trim() !== '' && role === 'customer') {
    this.router.navigate(['/home']);
    return false;
  }

  return true;
}

}
