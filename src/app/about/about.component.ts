import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  constructor(@Inject(DOCUMENT) document: Document) {
    const localStorage = document.defaultView?.localStorage;

    function clearHistory() {
      if (localStorage) {
        localStorage.clear();
      }
    }
  }
}
