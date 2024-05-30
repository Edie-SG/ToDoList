import { Component,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-paused',
  standalone: true,
  imports: [],
  templateUrl: './paused.component.html',
  styleUrl: './paused.component.css'
})
export class PausedComponent {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  restartButtonClick() {
    const header = this.document.querySelector("app-today header") as HTMLElement;
    const list = this.document.querySelector(".list") as HTMLElement;
    const paused = this.document.querySelector(".paused") as HTMLElement;

    header.classList.remove("active");
    list.classList.remove("active");
    paused.classList.remove("active");

    localStorage.setItem("headerClass", header.className);
    localStorage.setItem("listClass", list.className);
    localStorage.setItem("pausedClass", paused.className);
  }
}
