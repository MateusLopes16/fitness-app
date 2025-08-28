import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  icon?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: [
    './confirmation-dialog.component.scss',
    './confirmation-dialog.animations.scss',
    './confirmation-dialog.responsive.scss'
  ]
})
export class ConfirmationDialogComponent {
  @Input() isVisible = false;
  @Input() dialogData: ConfirmationDialogData | null = null;
  @Input() isProcessing = false;
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  getDefaultIcon(): string {
    switch (this.dialogData?.type) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
      default:
        return 'ℹ️';
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  onConfirm(): void {
    if (!this.isProcessing) {
      this.confirm.emit();
    }
  }

  onCancel(): void {
    if (!this.isProcessing) {
      this.cancel.emit();
    }
  }
}
