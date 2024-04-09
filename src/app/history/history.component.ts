import { Component, ElementRef, ViewChild, afterNextRender, Inject } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})

export class HistoryComponent {

  @ViewChild("cal") cal!: ElementRef;
  @ViewChild("mTopRow") mTopRow!: ElementRef;
  @ViewChild("m0m") m0m!: ElementRef;
  @ViewChild("calTitle") calTitle!: ElementRef;
  @ViewChild("prev") prev!: ElementRef;
  @ViewChild("next") next!: ElementRef;
  @ViewChild("sidePanelRight") sidePanelRight!: ElementRef;
  @ViewChild("sidePanelLeft") sidePanelLeft!: ElementRef;

  contentFinishedObject: {[key: string]: any[]} = {};
  sanityFinishedObject: {[key: string]: any[]} = {};
  contentPlanObject: {[key: string]: any[]} = {};
  
  constructor(@Inject(DOCUMENT) document: Document) {
    const localStorage = document.defaultView?.localStorage;
    if (localStorage) {
      const dayContentString = localStorage.getItem("FinishedContentAll");
      const daySanityString = localStorage.getItem("FinishedSanityAll");
      const planContentString = localStorage.getItem("PlanContentAll");

      const dayContent = dayContentString ? JSON.parse(dayContentString) : {};
      const daySanity = daySanityString ? JSON.parse(daySanityString) : {};
      const planContent = planContentString ? JSON.parse(planContentString) : {};
      
      if (dayContent) {
        this.contentFinishedObject = dayContent;
      }

      if (daySanity) {
        this.sanityFinishedObject = daySanity;
      }

      if (planContent) {
        this.contentPlanObject = planContent;
      }
    }

    afterNextRender(() => {
      const today: Date = new Date();
      const year: number = today.getUTCFullYear();
      this.renderCalendar(1, 12, year);

      this.HoverDateCallPanel();
      window.onhashchange = () => {
        this.handleHashChange();
        this.HoverDateCallPanel();
      }

      this.findToday();
    });
  }
  
  timeDiff () {
    var d = new Date();
    var time = d.getTime();
    return d.getTime() - time;
  };
  
  mTableLast = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  
  // End-of-month Julian Day lookup tables for normal and leap years
  jdTableN = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  jdTableL = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
  
  leap = false;
  jdTable = this.jdTableN;
  
  isLeap(year: number) {
    return (year % 100 != 0 && year % 4 == 0) || year % 400 == 0;
  }
  julianDay(day: number, month: number) {
    return day + this.jdTable[month - 1];
  }
  
  // returns the day of week as an integer: 1=Sun, 2=Mon, ..., 7=Sat
  dayOfWeek(day: number, month: number, year: number) {
    this.leap = this.isLeap(year);
    this.jdTable = this.leap ? this.jdTableL : this.jdTableN;
    var dow =
      (year +
        this.julianDay(day, month) +
        Math.floor((year - 1) / 4) -
        Math.floor((year - 1) / 100) +
        Math.floor((year - 1) / 400)) %
      7;
    return dow == 0 ? 7 : dow;
  }
  
  renderMonth(parent: Element, month: number, year: number) {
    var dateCells = parent.querySelectorAll("div.dt");
    var cellId = this.dayOfWeek(1, month, year) - 1;
    var max = this.mTableLast[month - 1];
    if (max == 28 && this.leap) max = 29;
  
    dateCells[cellId++].innerHTML = 1 + "";
    for (var ix = 2; ix <= max; ix++) {
      dateCells[cellId++].innerHTML = ix + "";
    }
    parent.querySelector("div.mo")!.innerHTML = this.mNames[month - 1] + "";
  }
  
  getMonthSequence(mainMonth: number) {
    var tmp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    if (mainMonth == 0) return tmp;
  
    var monthSeq = [];
    monthSeq.push(mainMonth);
    if (mainMonth == 11) {
      // n+1 isn't possible
      monthSeq.push(9);
      monthSeq.push(10);
      tmp.splice(9, 3);
    } else {
      monthSeq.push(mainMonth - 1);
      monthSeq.push(mainMonth + 1);
      tmp.splice(mainMonth - 1, 3);
    }
    return monthSeq.concat(tmp);
  }
  
  renderCalendar(startMonth: number, stopMonth: number, year: number) {
  
    this.timeDiff();
    var seqArgs = 0;
    var monthHtml = this.m0m.nativeElement.innerHTML;
    var monthSeq = this.getMonthSequence(seqArgs);
  
    this.calTitle.nativeElement.textContent = year;
    this.prev.nativeElement.innerHTML = year - 1;
    this.prev.nativeElement.setAttribute("href", window.location.pathname + "#" + (year - 1));
    this.next.nativeElement.innerHTML = year + 1;
    this.next.nativeElement.setAttribute("href", window.location.pathname + "#" + (year + 1));
  
    for (var ix = startMonth - 1; ix < stopMonth; ix++) {
      var newId = "#p" + ix;
      var idElements = this.mTopRow.nativeElement.querySelectorAll(newId);
      if (idElements.length == 1) {
        idElements[0].innerHTML = monthHtml;
        this.renderMonth(idElements[0], monthSeq[ix] + 1, year);
      }
    }
  }

  handleHashChange() {
    const today: Date = new Date();
    const year: number = today.getUTCFullYear();

    if (window.location.hash) {
      var hashValue = window.location.hash.replace("#", "");
      let hashNumber = Number(hashValue);

      if (/^\d{4}$/.test(hashValue)) {
        this.renderCalendar(1, 12, hashNumber);

      } else {
        this.renderCalendar(1, 12, year);
      }

      if (hashNumber === year) {
        this.findToday();
      }
    }
  }

  HoverDateCallPanel() {
    const parentCell = this.mTopRow.nativeElement;
    const dateCells = parentCell.querySelectorAll(".dt");
    dateCells.forEach(function(cell: any) {
      if (cell.innerHTML == "") {
        cell.style.pointerEvents = "none";
      }
    });

    this.dataPopPanel(parentCell, dateCells);
  }

  dataPopPanel(parentCell: Element, dateCells: any) {
    for (let i = 0; i < dateCells.length; i++) {
      const date = dateCells[i];
      date.addEventListener("click", () => {
        date.classList.toggle("active");
        dateCells.forEach((cell:Element) => {
          if (cell.classList.contains("active")) {
            cell.classList.remove("active");
            date.classList.add("active");
          }
        });

        const monthText = date.parentElement.querySelector(".mo").textContent;

        if (this.mNames.slice(0, 6).includes(monthText) && parentCell.querySelectorAll(".dt.active").length > 0) {
          this.sidePanelLeft.nativeElement.classList.add("active");
        } else {
          this.sidePanelLeft.nativeElement.classList.remove("active");
        }

        if (this.mNames.slice(6, 12).includes(monthText) && parentCell.querySelectorAll(".dt.active").length > 0) {
          this.sidePanelRight.nativeElement.classList.add("active");
        } else {
          this.sidePanelRight.nativeElement.classList.remove("active");
        }

        this.matchDayContentToPanel();
      });
    }
  }

  findToday() {
    const today: Date = new Date();
    const day: number = today.getDate();
    const currentMonth = today.toLocaleString("en-US", { month: "short"});
    const currentDayString = JSON.stringify(day);
    const months = this.mTopRow.nativeElement.querySelectorAll(".months");
    for (let i = 0; i < months.length; i++) {
      const monthRow = months[i].querySelector(".mo").textContent;
      if (monthRow === currentMonth) {
        const dayColumn = months[i].querySelectorAll(".dt");
        for (let ix = 0; ix < dayColumn.length; ix++) {
          if (dayColumn[ix].textContent === currentDayString) {
            dayColumn[ix].setAttribute("id", "today");
            dayColumn[ix].scrollIntoView({behavior: "smooth", block: "center"});
          }
        }
      }
    }

    console.log(day);
  }

  clickedDate() {
    const yearClick = this.calTitle.nativeElement.textContent;
    const container = this.mTopRow.nativeElement;
    if (container.querySelector(".dt.active")) {
      const parent = container.querySelector(".dt.active").parentElement;
      const monthClick = parent.querySelector(".mo").textContent;
      const monthNum = this.mNames.indexOf(monthClick) + 1;
      const dayClick = container.querySelector(".dt.active").textContent;

      let dateString = monthNum + "/" + dayClick + "/" + yearClick;
      return dateString;
    } else return "no date found";
  }

  matchDayContentToPanel() {
    const contentPanelL = this.sidePanelLeft.nativeElement.querySelector(".dateContentFinished ul");
    const sanityPanelL = this.sidePanelLeft.nativeElement.querySelector(".obtainedSanity .number");
    const planContentL = this.sidePanelLeft.nativeElement.querySelector(".dateContentPlan ul");
    const contentArray = this.contentFinishedObject[this.clickedDate()];
    const planArray = this.contentPlanObject[this.clickedDate()];

    if (contentArray) {
      let htmlList = contentArray.map(item => `<li>${item}</li>`).join("");
      contentPanelL.innerHTML = htmlList;

      const numberSanity = this.sanityFinishedObject[this.clickedDate()].map(el => Number(el));

      let totalSanity = numberSanity.reduce((total, current) => total + current, 0);
      sanityPanelL.textContent = totalSanity;
    } else {
      contentPanelL.textContent = "";
      sanityPanelL.textContent = "";
    }

    if (planArray) {
      let htmlList = planArray.map(item => `<li>${item}</li>`).join("");
      planContentL.innerHTML = htmlList;
    } else {
      planContentL.textContent = "";
    }

    this.sidePanelRight.nativeElement.innerHTML = this.sidePanelLeft.nativeElement.innerHTML;
  }
}
