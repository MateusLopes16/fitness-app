import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent {
  @Input() imageUrl: string = '';
  @Input() altText: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    if (this.isVisible) {
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    // Only close if clicking the backdrop, not the image itself
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onImageError(event: any) {
    console.error('Error loading image:', this.imageUrl);
    // You could set a fallback image here if needed
  }
}