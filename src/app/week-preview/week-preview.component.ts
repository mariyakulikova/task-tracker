import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../servises/firestore.service';
import {LogTime} from '../interfaces/logTime';

@Component({
  selector: 'app-week-preview',
  templateUrl: './week-preview.component.html',
  styleUrls: ['./week-preview.component.css']
})
export class WeekPreviewComponent implements OnInit {

  date: Date = new Date();
  arrDays: string[] = ['sun', 'mon', 'tue', 'wen', 'thu', 'fri', 'sat'];
  tasks: LogTime[] = [];
  totalHours: Date;

  constructor(private firestore: FirestoreService) {}

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

  onDelete(id: string) {
    this.firestore.deleteLog(id)
      .then(r => {
        this.tasks.splice(0, this.tasks.length);
        this.setTasks();
      });
  }

  private setTasks() {
    const d: Date = new Date(this.date.setHours(0, 0, 0));
    this.firestore.getTasks(d)
      .subscribe(value => {
        value.forEach(v => {
          this.tasks.push(v);
        });
        this.countTotalHours();
      });
  }

  private countTotalHours() {
    let countHours = 0;
    let countMinutes = 0;

    if (this.tasks.length === 0) {
      this.totalHours = new Date(this.date.setHours(0, 0, 0));
      return;
    }

    this.tasks.forEach(task => {
      countHours += task.duration.getHours();
      countMinutes += task.duration.getMinutes();
    });
    this.totalHours = new Date(countHours);
    this.totalHours.setHours(countHours);
    this.totalHours.setMinutes(countMinutes);
  }
}
