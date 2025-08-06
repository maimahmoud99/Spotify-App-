
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryStateService } from '../../services/category/category-state.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  showLoginPrompt = false;

  constructor(private router: Router, private categoryService: CategoryStateService) {}

  ngOnInit(): void {}

  // ✅ دالة تنقل مع شرط التوكن
  checkLoginAndNavigate(path: string, categoryName: string) {
    const token = localStorage.getItem('token');

    if (!token) {
      this.showLoginPrompt = true;

      // ✅ امنع التنقل
      return;
    }

    // ✅ المستخدم مسجل دخوله
    this.categoryService.setCategory(categoryName);
    this.router.navigate([path]);
  }

  // ✅ دوال التنقل
  goMen() {
    this.checkLoginAndNavigate('/men', 'men');
  }

  goHome() {
    this.checkLoginAndNavigate('/home', 'home');
  }

  goWomen() {
    this.checkLoginAndNavigate('/women', 'women');
  }

  goSupplement() {
    this.checkLoginAndNavigate('/supplements', 'supplements');
  }

  goEquipment() {
    this.checkLoginAndNavigate('/equipment', 'equipment');
  }

  goShoes() {
    this.checkLoginAndNavigate('/shoes', 'shoes');
  }

  // ✅ زرار Login من المودال
  navigateToLogin() {
    this.showLoginPrompt = false;
    this.router.navigate(['/login']);
  }
}
