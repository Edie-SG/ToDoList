import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  template: `
    <nav>
      <ul>
          <li><a routerLink="/today" [routerLinkActive] = "['is-active']">Today</a></li>
          <li><a routerLink="/history" [routerLinkActive] = "['is-active']">History</a></li>
          <li><a routerLink="/guide" [routerLinkActive] = "['is-active']">Guide</a></li>
          <li><a routerLink="/about" [routerLinkActive] = "['is-active']">About</a></li>
      </ul>
    </nav>
  `,
  styleUrl: './header.component.css'
})

export class HeaderComponent {

}
