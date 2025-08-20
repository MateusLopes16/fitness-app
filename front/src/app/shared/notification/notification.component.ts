import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NotificationData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon?: string;
  autoClose?: boolean;
  duration?: number;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input() isVisible = false;
  @Input() data: NotificationData | null = null;
  @Output() closed = new EventEmitter<void>();

  progressWidth = 100;
  private progressInterval?: any;

  ngOnInit(): void {
    if (this.data?.autoClose !== false) {
      this.startAutoClose();
    }
  }

  getDefaultIcon(): string {
    switch (this.data?.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  }

  private startAutoClose(): void {
    const duration = this.data?.duration || 4000;
    const interval = 50;
    const steps = duration / interval;
    const decrement = 100 / steps;

    this.progressInterval = setInterval(() => {
      this.progressWidth -= decrement;
      if (this.progressWidth <= 0) {
        this.close();
      }
    }, interval);
  }

  close(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.closed.emit();
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}
