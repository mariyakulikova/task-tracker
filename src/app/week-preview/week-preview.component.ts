import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../servises/firestore.service';
import {LogTime} from '../interfaces/logTime';
import {Subscription} from 'rxjs/internal/Subscription';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-week-preview',
  templateUrl: './week-preview.component.html',
  styleUrls: ['./week-preview.component.css']
})
export class WeekPreviewComponent implements OnInit {

  form: FormGroup;
  arrDays: string[] = ['sun', 'mon', 'tue', 'wen', 'thu', 'fri', 'sat'];
  tasks: LogTime[] = [];
  totalHours: Date;
  loading = false;

  private date: Date;
  private date$: Subject<Date> = new Subject();
  private phDate$: Subject<Date> = new Subject();
  private isClickedArr: boolean[] = [];
  private lastRunning: Subscription = null;

  constructor(private firestore: FirestoreService) {}

  ngOnInit(): void {
    this.date = history.state.data ? history.state.data : new Date();
    this.loadTasks();
    this.form = new FormGroup({
      date1: new FormControl(this.date.toLocaleDateString('fr-CA'))
    });

    this.phDate$.subscribe(value => this.form.get('date1').setValue(value.toLocaleDateString('fr-CA')));
    this.date$.pipe(debounceTime(300)).subscribe(val => this.loadTasks());
  }

  onLeftArrow() {
    this.loading = true;
    this.date = new Date(this.date.setDate(this.date.getDate() - 1));
    this.phDate$.next(this.date);
    this.date$.next(new Date(this.form.value.date1));
  }

  onRightArrow() {
    this.loading = true;
    this.date = new Date(this.date.setDate(this.date.getDate() + 1));
    this.phDate$.next(this.date);
    this.date$.next(new Date(this.form.value.date1));
  }

  onDelete(id: string, index: number) {
    this.isClickedArr.splice(index, 1);
    this.tasks.splice(index, 1);
    this.countTotalHours();
    this.firestore.deleteLog(id).catch(err => {});
  }

  onChange() {
    this.date = new Date(this.form.value.date1);
    this.date$.next(this.date);
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
