import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../servises/firestore.service';
import {AuthService} from '../servises/auth.service';
import {LogTime} from '../interfaces/logTime';
import * as firebase from 'firebase';

@Component({
  selector: 'app-week-preview',
  templateUrl: './week-preview.component.html',
  styleUrls: ['./week-preview.component.css']
})
export class WeekPreviewComponent implements OnInit{

  date: Date = new Date();
  arrDays: string[] = ['sun', 'mon', 'tue', 'wen', 'thu', 'fri', 'sat'];
  tasks: LogTime[] = [];

  constructor(
    private firestore: FirestoreService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.date = new Date();
    this.setTasks();
    console.log('local ', this.tasks);
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
    this.firestore.getTasks(this.auth.currentUser.uid, this.date)
      .subscribe(value => {
        value.forEach(v => {
          v.duration = this.countDuration(v.start, v.stop);
          this.tasks.push(v);
        });
      });
  }

  private countDuration(start: firebase.firestore.Timestamp | Date,
                        stop: firebase.firestore.Timestamp | Date): Date {

    const dif = stop.toMillis() - start.toMillis();
    const date = new Date(dif);
    date.setHours(date.getUTCHours());
    date.setMinutes(date.getUTCMinutes());
    date.setSeconds(date.getUTCSeconds());
    return date;
  }
}
