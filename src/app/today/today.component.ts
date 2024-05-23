import { Component, Inject, AfterViewInit, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [CommonModule, ListComponent],
  templateUrl: "./today.component.html",
  styleUrl: './today.component.css'
})

export class TodayComponent implements AfterViewInit{

  innerHeightA: number = 0;
  innerHeightS: number = 0;
  absurdIncrease: number = 1;
  absurdTimeStart: any;


  @ViewChild("absurdityInner") absurdityInner!: ElementRef;
  @ViewChild("sanityInner") sanityInner!: ElementRef;
  @ViewChild("timeStart") timeStart!: ElementRef;
  @ViewChild("timeEnd") timeEnd!: ElementRef;
  
   

  constructor(@Inject(DOCUMENT) document: Document) {
    let localStorage = document.defaultView?.localStorage;

    if (localStorage) {
      this.localStorageCheckData();
    }

    afterNextRender(() => {
      this.localStorageCheckDayTime();
      this.emptyEveryday();
      this.absurdityInner.nativeElement.style.height = this.innerHeightA + "%";
      this.sanityInner.nativeElement.style.height = this.innerHeightS + "%";
      
      window.onload = () => {
        this.checkInDayTime();
      }
    });
  }

  ngAfterViewInit() {
  }

  bottomBarToggle() {
    const eventTarget = event?.target as HTMLElement;
    eventTarget.classList.toggle("active");
  }

  localStorageCheckData() {
    const storedAbsurdString = localStorage.getItem("absurd");
    const storedSanityString = localStorage.getItem("sanity");
    const storedAbsurdValue = storedAbsurdString ? JSON.parse(storedAbsurdString) : 0;
    const storedSanityValue = storedSanityString ? JSON.parse(storedSanityString) : 0;

    if (storedAbsurdValue) {
      this.innerHeightA = storedAbsurdValue;
    }

    if (storedSanityValue) {
      this.innerHeightS = storedSanityValue;
    }
  }

  localStorageCheckDayTime() {
    const storedStartTime = localStorage.getItem("timeStart");
    const storedEndTime = localStorage.getItem("timeEnd");

    if (storedStartTime) {
      this.timeStart.nativeElement.value = storedStartTime;
    }

    this.timeStart.nativeElement.onchange = () => {
      localStorage.setItem("timeStart", this.timeStart.nativeElement.value);
    }

    if (storedEndTime) {
      this.timeEnd.nativeElement.value = storedEndTime;
    }

    this.timeEnd.nativeElement.onchange = () => {
      localStorage.setItem("timeEnd", this.timeEnd.nativeElement.value);
    }
  }

  hasLocalDatePassed() {
    const localDate: string = new Date().toLocaleDateString("en-US");

    if (localStorage.getItem("localDate") == localDate) return false;

    localStorage.setItem("localDate", localDate);
    return true;
  }

  emptyEveryday() {

    const timeStartValue: number = Number(this.timeStart.nativeElement.value);
    const timeEndValue: number = Number(this.timeEnd.nativeElement.value);
    const currentTime: number = new Date().getHours();

    if (timeEndValue >= timeStartValue) {
      if (this.hasLocalDatePassed()) {
        this.resetAbsurd();
        this.resetSanity();
      }
    } else {
      if (!this.hasLocalDatePassed()) {
        if (currentTime < timeStartValue && currentTime > timeEndValue) {
          this.resetAbsurd();
          this.resetSanity();
        }
      } else {
        if (currentTime > timeEndValue) {
          this.resetAbsurd();
          this.resetSanity();
        }
      }
    }
  }

  resetAbsurd() {
    this.innerHeightA = 0;
    localStorage.setItem("absurd", JSON.stringify(this.innerHeightA));
  }

  resetSanity() {
    this.innerHeightS = 0;
    localStorage.setItem("sanity", JSON.stringify(this.innerHeightS));
  }

  checkInDayTime() {
    const timeStartValue: number = Number(this.timeStart.nativeElement.value);
    const timeEndValue: number = Number(this.timeEnd.nativeElement.value);
    const currentHour: number = new Date().getHours();
    const currentMin: number = new Date().getMinutes();

    const waitMins: number = (timeStartValue - currentHour) * 60 - currentMin;

    if (timeEndValue >= timeStartValue) {
      if (timeStartValue <= currentHour && currentHour <= timeEndValue) this.absurdTimeFunc();
      else if (currentHour < timeStartValue){
        setTimeout(() => this.absurdTimeFunc(), waitMins * 60 * 1000);
      }
    } else {
      if (currentHour >= timeStartValue || currentHour <= timeEndValue) this.absurdTimeFunc();
      else if (currentHour < timeStartValue && currentHour > timeEndValue) {
        setTimeout(() => this.absurdTimeFunc(), waitMins * 60 * 1000);
      }
    }
  }

  absurdTimeFunc() {
    if (!this.absurdTimeStart) {
      this.absurdTimeStart = setInterval(() => {
        this.calculateAbsurd();
      }, 1000*1*1);
  
      if (this.innerHeightA >= 100) {
        clearInterval(this.absurdTimeStart);
        this.absurdTimeStart = null;
      }
    }
  }

  calculateAbsurd() {
    this.innerHeightA = this.innerHeightA + this.absurdIncrease;

    if (this.innerHeightA > 100) {
      this.innerHeightA = 100
    }
    
    this.updateAbsurd();
  }

  updateAbsurd() {
    this.absurdityInner.nativeElement.style.height = this.innerHeightA + "%";
    localStorage.setItem("absurd", JSON.stringify(this.innerHeightA));
    console.log(this.innerHeightA);
  }

  sanityInBrain(gotSanityNum: number) {
    this.innerHeightS = this.innerHeightS + gotSanityNum;
    localStorage.setItem("sanity", JSON.stringify(this.innerHeightS));

    if (this.innerHeightS <= 100) {
      this.sanityInner.nativeElement.style.height = this.innerHeightS + "%";
    } else {
      this.sanityInner.nativeElement.style.height = 100 + "%";
    }
  }

  absurdityCoffee() {
    this.innerHeightA = this.innerHeightA - 30;

    if (this.innerHeightA < 0) {
      this.innerHeightA = 0;
    }

    this.updateAbsurd();
    clearInterval(this.absurdTimeStart);
    this.absurdTimeStart = null;
  }

  absurditySweets() {
    this.innerHeightA = this.innerHeightA - 50;

    if (this.innerHeightA < 0) {
      this.innerHeightA = 0;
    }

    this.updateAbsurd();
    clearInterval(this.absurdTimeStart);
    this.absurdTimeStart = null;
  }

  absurdityPets() {
    this.innerHeightA = this.innerHeightA - 70;

    if (this.innerHeightA < 0) {
      this.innerHeightA = 0;
    }

    this.updateAbsurd();
    clearInterval(this.absurdTimeStart);
    this.absurdTimeStart = null;
  }
}
