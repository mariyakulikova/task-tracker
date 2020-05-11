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

  countDuration(task: LogTime): Date {
    const start = task.start as firebase.firestore.Timestamp;
    const stop = !!task.stop ? task.stop as firebase.firestore.Timestamp : firebase.firestore.Timestamp.now();
    const diff = stop.toMillis() - start.toMillis();

    let diffPause = 0;
    if (!!task.pause) {
      for (let i = 1; i < task.pause.length; i += 2) {
        diffPause +=
          ((task.pause[i] as firebase.firestore.Timestamp).toMillis()
            - (task.pause[i - 1] as firebase.firestore.Timestamp).toMillis());
      }
    }

    const duration = new Date(diff - diffPause);
    duration.setHours(duration.getUTCHours());
    duration.setMinutes(duration.getUTCMinutes());
    duration.setSeconds(duration.getUTCSeconds());
    return duration;
  }

  countDurationForTask(task: LogTime): Date {
    if (!task.stop) {
      return null;
    }
    return this.countDuration(task);
  }

  countDurationForTimer(task: LogTime): Date {
    const cloneTask: LogTime = {name: null, start: null};
    Object.assign(cloneTask, task);
    const now = Date.now();
    if (!!cloneTask.pause && cloneTask.pause.length % 2 !== 0) {
      cloneTask.pause = cloneTask.pause.slice();
      cloneTask.pause[cloneTask.pause.length] = firebase.firestore.Timestamp.fromMillis(now);
    }
    return this.countDuration(cloneTask);
  }
}
