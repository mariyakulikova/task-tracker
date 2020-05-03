import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../servises/firestore.service';
import {AuthService} from '../servises/auth.service';
import {LogTime} from '../interfaces/logTime';
import {TimerService} from '../servises/timer.service';

@Component({
  selector: 'app-week-preview',
  templateUrl: './week-preview.component.html',
  styleUrls: ['./week-preview.component.css']
})
export class WeekPreviewComponent implements OnInit {

  date: Date = new Date();
  arrDays: string[] = ['sun', 'mon', 'tue', 'wen', 'thu', 'fri', 'sat'];
  tasks: LogTime[] = [];

  constructor(
    private firestore: FirestoreService,
    private auth: AuthService,
    private timer: TimerService,
    ) {}

  ngOnInit(): void {
    this.date = new Date();
    this.setTasks();
  }

  onLeftArrow() {
    this.date = new Date(this.date.setDate(this.date.getDate() - 1));
    this.tasks.splice(0, this.tasks.length);
    this.setTasks();
  }

  onRightArrow() {
    this.date = new Date(this.date.setDate(this.date.getDate() + 1));
    this.tasks.splice(0, this.tasks.length);
    this.setTasks();
  }

  private setTasks() {
    const d: Date = new Date(this.date.setHours(0, 0, 0));
    this.firestore.getTasks(d)
      .subscribe(value => {
        value.forEach(v => {
          v.duration = this.timer.countDuration(
            v.start,
            v.stop
          );
          this.tasks.push(v);
        });
      });
  }
}
