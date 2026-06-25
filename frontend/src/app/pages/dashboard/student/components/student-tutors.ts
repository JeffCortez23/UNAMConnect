import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-tutors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-tutors.html'
})
export class StudentTutorsComponent {
  @Input() parent!: any;
}
