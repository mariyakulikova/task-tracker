import { Injectable } from '@angular/core';
import {timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor() { }

  start() {
    return timer(1000, 1000);
  }

  pause() {

  }

  stop() {

  }
}
