import { Routes } from '@angular/router';
import { TodayComponent } from './today/today.component';
import { HistoryComponent } from './history/history.component';
import { GuideComponent } from './guide/guide.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
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
];
