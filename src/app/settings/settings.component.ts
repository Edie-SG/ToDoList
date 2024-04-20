import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ElementRef, ViewChild, Output, EventEmitter, AfterViewInit, Inject, HostListener } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements AfterViewInit {

  @Output() dayNightMode = new EventEmitter<boolean>();
  @ViewChild("dropdownList") dropdownList?: ElementRef;
  @ViewChild("setting") setting?: ElementRef;
  
  isDayMode: boolean = true;
  rotation: number = 0;
  isDropdownOpen: boolean = false;

  constructor(@Inject(DOCUMENT) document: Document) {
    let localStorage = document.defaultView?.localStorage;

    if (localStorage) {
      const dayNightString = localStorage.getItem("dayNight");
      const dayNightRotateString = localStorage.getItem("dayNightRotate");
      const dayNight = dayNightString ? JSON.parse(dayNightString) : true;
      const dayNightRotate = dayNightRotateString ? JSON.parse(dayNightRotateString) : 0;

      this.isDayMode = dayNight;

      if ((dayNightRotate /180) % 2 === 0) {
        this.rotation = 0;
      } else {
        this.rotation = 180;
      }
    }
  }

  ngAfterViewInit() {
    this.setInitialDayNight();
  }

  setInitialDayNight() {
    const buttonSVG = this.dropdownList?.nativeElement.querySelector(".dayNight svg");
    this.dayNightMode.emit(this.isDayMode);
    buttonSVG.style.transform = `rotate(${this.rotation}deg)`;
  }

  dayNightButtonRotate() {
    const buttonSVG = this.dropdownList?.nativeElement.querySelector(".dayNight svg");

    this.isDayMode = !this.isDayMode;
    this.dayNightMode.emit(this.isDayMode);
    localStorage.setItem("dayNight", JSON.stringify(this.isDayMode));
    this.rotation += 180;
    buttonSVG.style.transform = `rotate(${this.rotation}deg)`;
    localStorage.setItem("dayNightRotate", JSON.stringify(this.rotation));
  }

  settingButton() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  cleanInPlan() {
    const localStorage = document.defaultView?.localStorage;
    if (localStorage) {
      if (localStorage.getItem("PlanContentAll")) {
        if (confirm('All "Still in plan" data in the history calendar will be been cleaned. Do you want to continue? Note: this will also clean the current "To Do List"')) {
          localStorage.removeItem("PlanContentAll");
          if (localStorage.getItem("todayList")) {
            localStorage.removeItem("todayList");
          }
          window.location.reload();
        }
      }
    }
  }

  cleanFinished() {
    const localStorage = document.defaultView?.localStorage;
    if (localStorage) {
      if (localStorage.getItem("FinishedContentAll")) {
        if (confirm('All "Finished activities" data in the history calendar will be been cleaned. Do you want to continue?')) {
          localStorage.removeItem("FinishedContentAll");
          window.location.reload();
        }
      }
    }

  }

  cleanAll() {
    const localStorage = document.defaultView?.localStorage;
    if (localStorage) {
      if (confirm("All stored data will be been cleaned. Do you want to continue?")) {
        localStorage.clear();
        window.location.reload();
      }
    }
  }
}
