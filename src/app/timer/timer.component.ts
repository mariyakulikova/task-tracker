import { Component, OnInit } from '@angular/core';
import {Observable, timer} from 'rxjs';
import {TimerService} from '../servises/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  t: Observable<any>;

  title = 'Task';
  started = false;

  constructor(private timerService: TimerService) {}

  onClickStart() {
    this.started = !this.started;
    this.t = this.timerService.start();
  }

}
