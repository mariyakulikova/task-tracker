import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UtilityService} from '../servises/utility.service';
import {FirestoreService} from '../servises/firestore.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LogTime} from '../interfaces/logTime';
import {Router} from '@angular/router';

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
    private timerService: UtilityService,
    private firestore: FirestoreService,
    private router: Router
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
    this.firestore.addNewLog(log).then(r => this.id = r);
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
    this.timerSubscription = this.timerService.startTimer().subscribe(() => {
      this.duration = new Date(this.duration.setSeconds(this.duration.getSeconds() + 1));
    });
  }
}
