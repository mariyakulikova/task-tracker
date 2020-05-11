import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UtilityService} from '../servises/utility.service';
import {FirestoreService} from '../servises/firestore.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LogTime} from '../interfaces/logTime';
import {Router} from '@angular/router';
import {CurrentRunningTask} from './current.running.task';
import * as firebase from 'firebase';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  timerSubscription: Subscription;
  duration: Date;
  timerState = 'not started';
  form: FormGroup;
  id: string;

  constructor(
    private utility: UtilityService,
    private firestore: FirestoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      note: new FormControl('')
    });
    this.duration = new Date(2020, 0, 0, 0, 0, 0);
    if (!!CurrentRunningTask.task) {
      this.form.get('title').setValue(CurrentRunningTask.task.name);
      this.form.get('note').setValue(CurrentRunningTask.task.comment);
      this.duration = this.utility.countDurationForTimer(CurrentRunningTask.task);

      if (CurrentRunningTask.task.hasOwnProperty('pause') && CurrentRunningTask.task.pause.length % 2 !== 0) {
        this.timerState = 'paused';
      } else {
        this.timerState = 'running';
      }
      this.id = CurrentRunningTask.task.id;
      console.log('onInit timerState: ', this.timerState);
      if (this.timerState === 'running') {
        this.startTimer();
      }
    }
  }

  onClickStart() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.timerState = 'running';
    this.startTimer();
    const log: LogTime = {
      name: this.form.value.title, start: firebase.firestore.Timestamp.now(), comment: this.form.value.note
    };
    console.log(log);
    this.firestore.addNewLog(log).then(r => this.id = r);
    CurrentRunningTask.task = log;
  }

  onClickStop() {
    if (this.timerState === 'not started') {
      return;
    }
    const date = new Date();
    this.timerSubscription.unsubscribe();
    if (this.timerState === 'paused') {
      this.firestore.updatePauseField(this.id, date);
    }
    this.timerState = 'stopped';
    this.firestore.addStopField(this.id, date)
      .then(r => this.router.navigate(['/calendar'], {state: {data: date}}));
    CurrentRunningTask.task = null;
  }

  onClickPause() {
    this.timerState = 'paused';
    this.timerSubscription.unsubscribe();
    this.updatePauseArr();
  }

  onClickResume() {
    this.timerState = 'running';
    this.startTimer();
    this.updatePauseArr();
  }

  showStartButton(): boolean {
    return this.timerState === 'not started' || this.timerState === 'stopped';
  }

  showPauseButton(): boolean {
    return this.timerState === 'running';
  }

  showResumeButton(): boolean {
    return this.timerState === 'paused';
  }

  private startTimer() {
    this.timerSubscription = this.utility.startTimer().subscribe(() => {
      this.duration = new Date(this.duration.setSeconds(this.duration.getSeconds() + 1));
    });
  }

  private updatePauseArr() {
    const date = new Date();
    this.firestore.updatePauseField(this.id, date);
    if (!CurrentRunningTask.task.pause) {
      CurrentRunningTask.task.pause = [];
    }
    CurrentRunningTask.task.pause[CurrentRunningTask.task.pause.length] = firebase.firestore.Timestamp.fromDate(date);
  }
}
