import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { filter } from "rxjs/operators"

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  constructor(private elementRef: ElementRef, private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.bodyHomeStyle();
    });
  }

  bodyHomeStyle() {
    const body = this.elementRef.nativeElement.parentElement;
  
    if (window.location.pathname === "/home") {
      body?.classList.add("home");
    } else {
      body?.classList.remove("home");
    }
  }
}
