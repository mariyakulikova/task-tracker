import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FirestoreService} from '../servises/firestore.service';
import {LogTime} from '../interfaces/logTime';
import {TimerService} from '../servises/timer.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  form: FormGroup;
  duration: Date;

  constructor(
    private firestore: FirestoreService,
    private timer: TimerService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      note: new FormControl(null),
      date: new FormControl(null,
        Validators.required),
      start: new FormControl(null, Validators.required),
      stop: new FormControl(null, Validators.required)
      }
    );
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const log: LogTime = {
      name: this.form.value.name,
      start: new Date(this.form.value.date.concat('T', this.form.value.start)),
      stop: new Date(this.form.value.date.concat('T', this.form.value.stop)),

      comment: this.form.value.note
    }
    this.firestore.addNewLog(log, log.start as Date);
    this.duration = this.timer.countDuration(log.start as Date, log.stop as Date);
    this.form.reset();
  }

  onCancel() {
    this.form.reset();
  }

}
