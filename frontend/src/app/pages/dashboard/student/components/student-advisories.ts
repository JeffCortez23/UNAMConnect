import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-advisories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-advisories.html'
})
export class StudentAdvisoriesComponent {
  @Input() parent!: any;
}
