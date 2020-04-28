import { Injectable } from '@angular/core';
import {Observable, timer} from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private timer: Observable<any>;

  start() {
    this.timer = timer(1000, 1000);
    return this.timer;
  }

  countDuration(
    start: firebase.firestore.Timestamp | Date,
    stop: firebase.firestore.Timestamp | Date
  ): Date {
    let dif = 0;
    if (start instanceof firebase.firestore.Timestamp && stop instanceof firebase.firestore.Timestamp) {
      dif = stop.toMillis() - start.toMillis();
    } else if (start instanceof Date && stop instanceof Date) {
      dif = start.getMilliseconds() - stop.getMilliseconds();
    }
    const date = new Date(dif);
    date.setHours(date.getUTCHours());
    date.setMinutes(date.getUTCMinutes());
    date.setSeconds(date.getUTCSeconds());
    return date;
  }
}
