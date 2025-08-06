import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/products/product.service';

@Component({
  selector: 'app-reviewcard',
  imports: [CommonModule, RouterModule],
  templateUrl: './reviewcard.component.html',
  styleUrl: './reviewcard.component.css',
  providers: [ProductService],
})
export class ReviewcardComponent {}
