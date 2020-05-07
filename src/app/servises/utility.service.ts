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
    let dif = 0;
    if (task.start instanceof firebase.firestore.Timestamp && task.stop instanceof firebase.firestore.Timestamp) {
      dif = task.stop.toMillis() - task.start.toMillis();
    }

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
