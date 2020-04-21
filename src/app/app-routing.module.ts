import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {WeekPreviewComponent} from './week-preview/week-preview.component';
import {TimerComponent} from './timer/timer.component';
import {EditComponent} from './edit/edit.component';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent
  },
  {
    path: 'calendar',
    component: WeekPreviewComponent
  },
  {
    path: 'timer',
    component: TimerComponent
  },
  {
    path: 'edit',
    component: EditComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
