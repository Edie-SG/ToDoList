import { Component, ElementRef, ViewChild, Input, Inject, AfterViewInit, Output, EventEmitter, afterNextRender } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ItemDetail } from './item-detail';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./list.component.html",
  styleUrl: './list.component.css'
})

export class ListComponent implements AfterViewInit {
  @Input() itemDetail!: ItemDetail;
  @Output() checkFinishEvent = new EventEmitter<number>();

  @ViewChild("content") content!: ElementRef;
  @ViewChild("sanity") sanity!: ElementRef;
  @ViewChild("totalValue") totalValue!: ElementRef;
  @ViewChild("lists") lists!: ElementRef;
  @ViewChild("add") add!: ElementRef;

  contentFinishedObject: {[key: string]: any[]} = {};
  sanityFinishedObject: {[key: string]: any[]} = {};
  contentPlanObject: {[key: string]: any[]} = {};
  itemList: ItemDetail[] = [];

  constructor(@Inject(DOCUMENT) document: Document) {
    const localStorage = document.defaultView?.localStorage;
    const currentDate: string = new Date().toLocaleDateString("en-US");

    if (localStorage) {
      const storedListString = localStorage.getItem("todayList");
      const storedList = storedListString ? JSON.parse(storedListString) : [];
      if (storedList) {
        this.itemList = storedList;
      }

      const contentFinishedString = localStorage.getItem("FinishedContentAll");
      const contentFinishedObject = contentFinishedString ? JSON.parse(contentFinishedString) : {};
      if (contentFinishedObject) {
        this.contentFinishedObject = contentFinishedObject;
      }

      const sanityFinishedString = localStorage.getItem("FinishedSanityAll");
      const sanityFinishedObject = sanityFinishedString ? JSON.parse(sanityFinishedString) : {};
      if (sanityFinishedObject) {
        this.sanityFinishedObject = sanityFinishedObject;
      }

      const contentPlanString = localStorage.getItem("PlanContentAll");
      const contentPlanObject = contentPlanString ? JSON.parse(contentPlanString) : {};
      if (contentPlanObject) {
        this.contentPlanObject = contentPlanObject;
      }

      const keys = Object.keys(this.contentPlanObject);
      const previousWorkingDay = keys[keys.length - 1];

      if (!this.contentPlanObject[currentDate]) {
        if (this.contentPlanObject[previousWorkingDay]) {
          this.contentPlanObject[currentDate] = this.contentPlanObject[previousWorkingDay];
          localStorage.setItem("PlanContentAll", JSON.stringify(this.contentPlanObject));

        } else {
          this.contentPlanObject[currentDate] = [];
        }
      }
    }

    afterNextRender(() => {
      const keys = Object.keys(this.contentPlanObject);
      const previousWorkingDay = keys[keys.length - 2];
      if (previousWorkingDay) {
        this.checkEditPossibility(previousWorkingDay);
      }
    });
  }

  ngAfterViewInit() {
    this.totalValueDemo();
  }

  addButton() {
    this.pushList();
    this.checkTotalValue();
    this.totalValueDemo();
    this.maxInput();
    this.placeHolderRange();

    this.content.nativeElement.value = "";
    this.sanity.nativeElement.value = "";
    this.content.nativeElement.focus();

    localStorage.setItem("todayList", JSON.stringify(this.itemList));
    this.add.nativeElement.classList.add("active");
    setTimeout(() => {this.add.nativeElement.classList.remove("active")}, 800);
  }

  pushList() {
    let taskContent = this.content.nativeElement.value;
    let sanityNumber = this.sanity.nativeElement.value;
    let NumSanityNumber = Number(sanityNumber);

    if (taskContent != "" && NumSanityNumber <= this.maxInput()) {
      this.itemList.push({
        activity: taskContent, 
        sanity: NumSanityNumber,
      });

      this.updatePlanDataToLocalStorage(taskContent);
    }
  }

  checkTotalValue() {
    const sanityArray = [];

    for (let i = 0; i < this.itemList.length; i++) {
      sanityArray.push(this.itemList[i].sanity);
    }
    
    let sanityNumArray: number[] = sanityArray.map(Number);
    let totalSanityArray = sanityNumArray.reduce((total, current) => total + current, 0);

    return totalSanityArray;
  }

  totalValueDemo() {
    this.totalValue.nativeElement.innerHTML = this.checkTotalValue();
    
    if (this.checkTotalValue() > 100) {
      this.totalValue.nativeElement.classList.add("overload");
    } else {
      this.totalValue.nativeElement.classList.remove("overload");
    }
  }

  maxInput() {
    if (this.checkTotalValue() <= 100) {
      let remainSanity = 100 - this.checkTotalValue();
      return remainSanity;
    } else {
      return 0;
    }
  }

  placeHolderRange() {return "0-" + this.maxInput()};

  randomDistribution(arrayLength: number): number[] {
    const divider: number[] = this.getUniqueNumbers(arrayLength - 1, 1, 100);
    const randomResults: number[] = [];

    const firstRandom: number = divider[0];
    randomResults.push(firstRandom);

    for (let i = 0; i < (divider.length - 1); i++) {
      const random = divider[i + 1] - divider[i];
      randomResults.push(random);
    }
    const lastIndex:number = divider.length - 1;
    const lastRandom: number = 100 - divider[lastIndex];
    randomResults.push(lastRandom);
    return randomResults;
  }

  getUniqueNumbers(amount: number, min: number, max: number): number[] {
    if (amount > (max - min + 1) || max < min) {
      throw new Error("Task number overflow or invalid input parameters");
    }

    const uniqueNumbers: Set<number> = new Set();
    const result: number[] = [];

    while (uniqueNumbers.size < amount) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      uniqueNumbers.add(randomNumber);
    }

    uniqueNumbers.forEach(num => result.push(num));

    result.sort((a,b) => a - b);

    return result;
  }

  randomButton() {
    const arrayLength = this.itemList.length;
    const rSanityArray: number[] = this.randomDistribution(arrayLength);

    for (let i = 0; i < arrayLength; i++) {
      this.itemList[i].sanity = rSanityArray[i];
    }

    this.totalValueDemo();

    localStorage.setItem("todayList", JSON.stringify(this.itemList));
  }

  editButton() {
    const eventElement = event?.target as HTMLElement;
    const parent = eventElement.parentElement;
    const originalContent = parent?.querySelector(".itemContent")?.textContent;

    if (parent) {
      parent.setAttribute("contenteditable", "true");
      parent.focus();

      parent.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          parent.setAttribute("contenteditable", "false");
          this.updateArray();
          this.totalValueDemo();

          const newContent = parent?.querySelector(".itemContent")?.textContent;
          if (originalContent) {
            this.replaceEditedData(originalContent, newContent!);
          }
        }
      });
    }
  }

  updateArray() {
    const itemContent = document.querySelectorAll(".itemContent");
    const itemSanity = document.querySelectorAll(".itemSanity");
    const newList = [];

    for (let i = 0; i < itemContent.length; i++) {
      const contentText: string = itemContent[i].textContent!;
      const sanityText = itemSanity[i].textContent;

      newList.push({
        activity: contentText,
        sanity: Number(sanityText),
      });

      this.itemList[i] = newList[i];
    }

    localStorage.setItem("todayList", JSON.stringify(this.itemList));
  }

  deleteButton() {
    const eventElement = event?.target as HTMLElement;
    const liElement = eventElement.parentElement;
    const currentContent: string = liElement!.querySelector(".itemContent")!.textContent!;
    const currentSanity = liElement!.querySelector(".itemSanity")!.textContent;

    this.itemList = this.itemList.filter(itemDetail => !(itemDetail.activity === currentContent && itemDetail.sanity === Number(currentSanity)));

    this.totalValueDemo();
    localStorage.setItem("todayList", JSON.stringify(this.itemList));
    this.findRemovedItemFromPlan(currentContent);
  }

  radioLabelButton() {
    const labelElement = event?.target as HTMLElement;
    const inputElement = labelElement.previousElementSibling;
    labelElement.classList.add("active");

    this.pushSanityNumberToParent(inputElement); 
    this.updateFinishedDataToLocalStorage(inputElement); 
    this.removeItemFinished(inputElement);
  }

  pushSanityNumberToParent(eventElement: any) {
    const gotSanity = eventElement.parentElement?.querySelector(".itemSanity")?.textContent;
    let gotSanityNum = Number(gotSanity);
    this.checkFinishEvent.emit(gotSanityNum);
  }

  updateFinishedDataToLocalStorage(eventElement: any) {
    const currentDate: string = new Date().toLocaleDateString("en-US"); 
    const content = eventElement.parentElement?.querySelector(".itemContent")?.textContent;
    const sanity = eventElement.parentElement?.querySelector(".itemSanity")?.textContent;

    if (this.contentFinishedObject[currentDate]) {
      this.contentFinishedObject[currentDate].push(content);
      this.sanityFinishedObject[currentDate].push(sanity);
    } else {
      this.contentFinishedObject[currentDate] = [];
      this.sanityFinishedObject[currentDate] = [];
      this.contentFinishedObject[currentDate].push(content);
      this.sanityFinishedObject[currentDate].push(sanity);
    }

    localStorage.setItem("FinishedContentAll", JSON.stringify(this.contentFinishedObject));
    localStorage.setItem("FinishedSanityAll", JSON.stringify(this.sanityFinishedObject));
  }

  updatePlanDataToLocalStorage(content: string) {
    const newDay = new Date().toLocaleDateString("en-US");
    const keys = Object.keys(this.contentPlanObject);
    const previousWorkingDay = keys[keys.length - 1];

    if (this.contentPlanObject[newDay]) {
      this.contentPlanObject[newDay] = [...this.contentPlanObject[newDay], content];
    }
    
    else if (this.contentPlanObject[previousWorkingDay]) {
      this.contentPlanObject[newDay] = [...this.contentPlanObject[previousWorkingDay], content];
    }

    else {
      this.contentPlanObject[newDay] = [content];
    }

    localStorage.setItem("PlanContentAll", JSON.stringify(this.contentPlanObject));
  }

  replaceEditedData(originalContent: string, newContent: string) {
    const currentDate = new Date().toLocaleDateString("en-US");
    const index = this.contentPlanObject[currentDate].indexOf(originalContent);
    if (index > -1) {
      this.contentPlanObject[currentDate][index] = newContent;
      localStorage.setItem("PlanContentAll", JSON.stringify(this.contentPlanObject));
    } else if (this.contentPlanObject[currentDate]) {
      this.contentPlanObject[currentDate].push(newContent);
      localStorage.setItem("PlanContentAll", JSON.stringify(this.contentPlanObject));
    }
  }

  checkEditPossibility(previousWorkingDay: string) {
    const contents = document.querySelectorAll(".itemContent");
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i] as HTMLElement;
      const contentText = content.textContent;
      if (this.contentPlanObject[previousWorkingDay]) {
        const index = this.contentPlanObject[previousWorkingDay].indexOf(contentText);
        if (index > -1) {
          content.parentElement!.style.pointerEvents = "none";
        }
      }
    }
  }

  removeItemFinished(currentTarget: any) {
    setTimeout(() => {
      const liElement = currentTarget.parentElement;
      const currentContent: string = liElement!.querySelector(".itemContent")!.textContent!;
      const currentSanity = liElement!.querySelector(".itemSanity")!.textContent;
  
      this.itemList = this.itemList.filter(itemDetail => !(itemDetail.activity === currentContent && itemDetail.sanity === Number(currentSanity)));
  
      this.totalValueDemo();
      localStorage.setItem("todayList", JSON.stringify(this.itemList));

      this.findRemovedItemFromPlan(currentContent);
    }, 500);
  }

  findRemovedItemFromPlan(content: string) {
    const currentDate = new Date().toLocaleDateString("en-US");
    const index: number = this.contentPlanObject[currentDate].indexOf(content);
    if (index > -1) {
      this.contentPlanObject[currentDate].splice(index, 1);
      localStorage.setItem("PlanContentAll", JSON.stringify(this.contentPlanObject));
    }
  }

  hoverTargetHappen() {
    const button = event?.target as HTMLElement;
    button.addEventListener("mousemove", (event) => this.hoverFollowMouse(button, event));
  }

  hoverFollowMouse(button: any, event: MouseEvent) {
    const buttonRect = button.getBoundingClientRect();
    const target = button.querySelector(".radioButton .target");
    const hole = button.querySelector(".radioButton .hole");
    const targetRect = target?.getBoundingClientRect();
    const range = {
      minX: buttonRect.left - 20,
      maxX: buttonRect.right + 20,
      minY: buttonRect.top - 20,
      maxY: buttonRect.bottom + 20
    };

    const newX = Math.max(range.minX, Math.min(range.maxX, event.clientX - (targetRect.width / 2)));
    const newY = Math.max(range.minY, Math.min(range.maxY, event.clientY - (targetRect.height / 2)));

    const newOffsetX = newX - buttonRect.left;
    const newOffsetY = newY - buttonRect.top;

    target.style.left = `${newOffsetX}px`;
    target.style.top = `${newOffsetY}px`;
    hole.style.left = `${newOffsetX}px`;
    hole.style.top = `${newOffsetY}px`;
  }

  targetPositionReset() {
    const button = event?.target as HTMLElement;
    const target: any = button.querySelector(".radioButton .target");
    const hole: any = button.querySelector(".radioButton .hole");

    target.style.left = "0px";
    target.style.top = "0px";
    hole.style.left = "0px";
    hole.style.top = "0px";
  }
}
