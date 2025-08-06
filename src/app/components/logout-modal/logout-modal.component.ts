import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-logout-modal',
  imports: [CommonModule],
  templateUrl: './logout-modal.component.html',
  styleUrl: './logout-modal.component.css'
})
export class LogoutModalComponent {
  @Output() confirmLogout = new EventEmitter<void>();
  @ViewChild('logoutModal') logoutModal!: ElementRef<HTMLDialogElement>;

  open() {
    this.logoutModal.nativeElement.showModal();
  }

  close() {
    this.logoutModal.nativeElement.close();
  }
    handleConfirm() {
        this.confirmLogout.emit(); 
        this.close();
      }

}
