import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {WeekPreviewComponent} from './week-preview/week-preview.component';
import {TimerComponent} from './timer/timer.component';
import {EditComponent} from './edit/edit.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {AuthGuard} from './servises/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent
  },
  {
    path: 'calendar',
    component: WeekPreviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'timer',
    component: TimerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit',
    component: EditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'error',
    component: NotFoundComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
