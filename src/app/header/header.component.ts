import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <nav>
      <ul>
          <li><a routerLink="/today">Today</a></li>
          <li><a routerLink="/history">History</a></li>
          <li><a routerLink="/guide">Guide</a></li>
          <li><a routerLink="/about">About</a></li>
      </ul>
    </nav>
  `,
  styleUrl: './header.component.css'
})

export class HeaderComponent {

}
