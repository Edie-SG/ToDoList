import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TodayComponent } from './today/today.component';
import { HistoryComponent } from './history/history.component';
import { GuideComponent } from './guide/guide.component';
import { AboutComponent } from './about/about.component';
import { PausedComponent } from './paused/paused.component';

export const routes: Routes = [
    {
        path: "", redirectTo: "/home", pathMatch: "full",
    },

    {
        path: "home",
        component: HomeComponent,
    },

    {
        path: "today",
        component: TodayComponent,
    },

    {
        path: "history",
        component: HistoryComponent,
    },

    {
        path: "guide",
        component: GuideComponent,
    },

    {
        path: "about",
        component: AboutComponent,
    },

    {
        path: "paused",
        component: PausedComponent,
    }
];
