import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryStateService {
  private currentCategorySubject = new BehaviorSubject<string>('');
  currentCategory$ = this.currentCategorySubject.asObservable();

  setCategory(category: string) {
    this.currentCategorySubject.next(category);
  }

  getCategory() {
    return this.currentCategorySubject.getValue();
  }
}
