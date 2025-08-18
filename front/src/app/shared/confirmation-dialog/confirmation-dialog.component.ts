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
  template: `
    <div class="confirmation-overlay" *ngIf="isVisible" (click)="onOverlayClick($event)">
      <div class="confirmation-dialog" [class]="dialogData?.type || 'info'">
        <div class="dialog-header">
          <div class="dialog-icon">
            {{ dialogData?.icon || getDefaultIcon() }}
          </div>
          <h3 class="dialog-title">{{ dialogData?.title }}</h3>
        </div>
        
        <div class="dialog-content">
          <p class="dialog-message">{{ dialogData?.message }}</p>
        </div>
        
        <div class="dialog-actions">
          <button 
            class="cancel-btn" 
            (click)="onCancel()"
            [disabled]="isProcessing">
            {{ dialogData?.cancelText || 'Cancel' }}
          </button>
          <button 
            class="confirm-btn" 
            [class]="dialogData?.type || 'info'"
            (click)="onConfirm()"
            [disabled]="isProcessing">
            <span *ngIf="!isProcessing">{{ dialogData?.confirmText || 'Confirm' }}</span>
            <span *ngIf="isProcessing" class="loading-content">
              <span class="loading-spinner"></span>
              Processing...
            </span>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./confirmation-dialog.component.scss']
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
