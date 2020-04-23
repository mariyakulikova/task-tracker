import { Injectable } from '@angular/core';
import {Observable, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private timer: Observable<any>;

  start() {
    this.timer = timer(1000, 1000);
    return this.timer;
  }
}
