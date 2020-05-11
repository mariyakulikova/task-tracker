import { Injectable } from '@angular/core';
import {Observable, timer} from 'rxjs';
import * as firebase from 'firebase';
import {LogTime} from '../interfaces/logTime';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  private timer: Observable<any>;

  startTimer() {
    this.timer = timer(1000, 1000);
    return this.timer;
  }

  countDuration(task: LogTime): LogTime {
    let dif: number;
    if (!task.stop) {
      task.duration = null;
      return task;
    }
    const start = task.start as firebase.firestore.Timestamp;
    const stop = task.stop as firebase.firestore.Timestamp;
    dif = stop.toMillis() - start.toMillis();

    let difPause = 0;
    if (!!task.pause) {
      for (let i = 1; i < task.pause.length; i += 2) {
        difPause +=
          ((task.pause[i] as firebase.firestore.Timestamp).toMillis()
          - (task.pause[i - 1] as firebase.firestore.Timestamp).toMillis());
      }
    }

    const date = new Date(dif - difPause);
    date.setHours(date.getUTCHours());
    date.setMinutes(date.getUTCMinutes());
    date.setSeconds(date.getUTCSeconds());
    task.duration = date;
    return task;
  }
}
