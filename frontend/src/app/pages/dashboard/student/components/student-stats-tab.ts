import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-stats-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-stats-tab.html'
})
export class StudentStatsTabComponent {
  @Input() parent!: any;
}
