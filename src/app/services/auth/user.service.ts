import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userDataSubject = new BehaviorSubject<any>(null);

  setUserData(data: any): void {
    this.userDataSubject.next(data);
  }

  getUserData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }
}
