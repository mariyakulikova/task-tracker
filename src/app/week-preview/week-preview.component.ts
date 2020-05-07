import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FirestoreService} from '../servises/firestore.service';
import {LogTime} from '../interfaces/logTime';
import {Subscription} from 'rxjs/internal/Subscription';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

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
  dateSubject: Subject<Date> = new Subject();
  private isClickedArr: boolean[] = [];

  lastRunning: Subscription = null;

  loading = false;

  constructor(private firestore: FirestoreService) {}

  ngOnInit(): void {
    this.date = new Date();
    this.loadTasks();
    this.dateSubject
      .pipe(debounceTime(300))
      .subscribe(val => {
        this.loadTasks();
      });
  }

  onLeftArrow() {
    this.loading = true;
    this.date = new Date(this.date.setDate(this.date.getDate() - 1));
    this.dateSubject.next(this.date);
  }

  onRightArrow() {
    this.loading = true;
    this.date = new Date(this.date.setDate(this.date.getDate() + 1));
    this.dateSubject.next(this.date);
  }

  onDelete(id: string, index: number) {
    this.isClickedArr.splice(index, 1);
    this.tasks.splice(index, 1);
    this.firestore.deleteLog(id);
    this.countTotalHours();
  }

  isVisible(index: number): boolean {
    return this.isClickedArr[index];
  }

  onClick(index: number) {
    this.isClickedArr[index] = !this.isClickedArr[index];
  }

  private loadTasks() {
    this.loading = true;
    if (this.lastRunning) {
      this.lastRunning.unsubscribe();
    }

    const d: Date = new Date(this.date.setHours(0, 0, 0));

    this.lastRunning = this.firestore.getTasks(d)
      .subscribe(value => {
        this.tasks.splice(0, this.tasks.length);
        value.forEach(v => {
          this.tasks.push(v);
        });
        this.countTotalHours();
        this.setupIsClickedArr();
        this.loading = false;
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

  private setupIsClickedArr() {
    for (let i = 0; i < this.tasks.length; i++) {
      this.isClickedArr[i] = true;
    }
  }
}
