import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Location, CommonModule } from "@angular/common"
import { HeaderComponent } from './header/header.component';
import { SettingsComponent } from './settings/settings.component';
import { filter } from "rxjs/operators"

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, HeaderComponent, SettingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  constructor(private elementRef: ElementRef, private router: Router, private location: Location) {}

  body = this.elementRef.nativeElement.parentElement;
  html = this.body.parentElement;

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.bodyHomeStyle();
    });
  }

  bodyHomeStyle() {
  
    if (this.location.path() === "/home") {
      this.body.classList.add("home");
    } else {
      this.body.classList.remove("home");
    }
  }

  dayNightStyleSwitch(isDayMode: boolean) {
    if (isDayMode) {
      this.body.classList.remove("dark");
      this.body.classList.add("bright");
      this.html.classList.remove("dark");
      this.html.classList.add("bright");
    } else {
      this.body.classList.remove("bright");
      this.body.classList.add("dark");
      this.html.classList.remove("bright");
      this.html.classList.add("dark");
    }
  }
}
