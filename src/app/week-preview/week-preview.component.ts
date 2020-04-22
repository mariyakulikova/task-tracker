import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-week-preview',
  templateUrl: './week-preview.component.html',
  styleUrls: ['./week-preview.component.css']
})
export class WeekPreviewComponent implements OnInit {

  date: Date;
  arrDays: string[];

  constructor() { }

  ngOnInit(): void {
    this.date = new Date();
    this.arrDays = ['sun', 'mon', 'tue', 'wen', 'thu', 'fri', 'sat'];
  }

  onLeftArrow() {
   this.date = new Date(this.date.setDate(this.date.getDate() - 1));
  }

  onRightArrow() {
    this.date = new Date(this.date.setDate(this.date.getDate() + 1));
  }

}
