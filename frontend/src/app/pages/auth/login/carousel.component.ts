import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Carousel with cross-fade -->
    <div class="carousel-wrapper">
      @for (slide of slides; track $index) {
        <div class="carousel-slide" [class.active]="$index === currentSlideIndex()">
          <h1 [innerHTML]="slide.title"></h1>
          <p>{{ slide.desc }}</p>
        </div>
      }
    </div>

    <div class="carousel-controls">
      <div class="dots-indicator d-flex gap-1">
        @for (s of slides; track $index) {
          <span class="dot"
                [class.active]="$index === currentSlideIndex()"
                (click)="goToSlide($index)"></span>
        }
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" [style.width.%]="slideProgress()"></div>
      </div>
    </div>
  `,
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnDestroy {
  currentSlideIndex = signal(0);
  slideProgress = signal(0);
  private progressTimerId: any;

  slides = [
    {
      title: 'Conecta con el <br><span class="accent">conocimiento</span> de <br>tu universidad',
      desc: 'Tutorías universitarias para todo el Perú. Agenda sesiones, mejora tus notas y avanza con los mejores de tu facultad.'
    },
    {
      title: 'Encuentra el <br><span class="accent">tutor ideal</span> para <br>tus cursos',
      desc: 'Filtra por carrera, materia y horarios. Aprende a tu propio ritmo con asesorías personalizadas virtuales.'
    },
    {
      title: 'Habilita tu <br><span class="accent">potencial</span> <br>enseñando',
      desc: 'Si tienes excelentes calificaciones, postula para ser tutor, ayuda a tus compañeros y certifica tus horas académicas.'
    }
  ];

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  private startCarousel(): void {
    this.slideProgress.set(0);
    let progress = 0;
    this.progressTimerId = setInterval(() => {
      progress += 1;
      this.slideProgress.set(progress);
      if (progress >= 100) {
        progress = 0;
        this.slideProgress.set(0);
        this.currentSlideIndex.update(idx => (idx + 1) % this.slides.length);
      }
    }, 40);
  }

  private stopCarousel(): void {
    if (this.progressTimerId) {
      clearInterval(this.progressTimerId);
    }
  }

  goToSlide(index: number): void {
    this.currentSlideIndex.set(index);
    this.slideProgress.set(0);
  }
}
