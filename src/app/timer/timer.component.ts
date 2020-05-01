import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {TimerService} from '../servises/timer.service';
import {FirestoreService} from '../servises/firestore.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LogTime} from '../interfaces/logTime';

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
    private timerService: TimerService,
    private firestore: FirestoreService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
        title: new FormControl('', Validators.required),
        note: new FormControl('')
    });
    this.duration = new Date(2020, 0, 0, 0, 0, 0);
  }

  onClickStart() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.timerState = 'running';
    this.startTimer();
    const log: LogTime = {
      name: this.form.value.title, start: new Date(), comment: this.form.value.note
    }
    console.log(log);
    this.id = this.firestore.addNewLog(log, new Date());
  }

  onClickStop() {
    if (this.timerState === 'not started') {
      return;
    }
    this.timerSubscription.unsubscribe();
    this.timerState = 'stopped';
    const date = new Date();
    this.firestore.addStopField(this.id, date);
    this.form.reset();
    this.duration = new Date(2020, 0, 0, 0, 0, 0);
  }

  onClickPause() {
    this.timerState = 'paused';
    this.timerSubscription.unsubscribe();
    this.firestore.updatePauseField(this.id, new Date());
  }

  onClickResume() {
    this.timerState = 'running';
    this.startTimer();
    this.firestore.updatePauseField(this.id, new Date());
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
    this.timerSubscription = this.timerService.start().subscribe(() => {
      this.duration = new Date(this.duration.setSeconds(this.duration.getSeconds() + 1));
    });
  }
}
