import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FirestoreService} from '../servises/firestore.service';
import {LogTime} from '../interfaces/logTime';
import {ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase';

export interface Placeholder {
  date: string;
  timeStart: string;
  timeStop: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  form: FormGroup;
  task: LogTime;
  placeholder: Placeholder;

  constructor(
    private firestore: FirestoreService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.task = this.activatedRoute.snapshot.data.task as LogTime;
    this.setPlaceholder();
    this.form = new FormGroup({
        name: new FormControl(this.task ? this.task.name : null, Validators.required),
        note: new FormControl(this.task ? this.task.comment : null),
        date: new FormControl(this.placeholder.date, Validators.required),
        start: new FormControl(this.placeholder.timeStart, Validators.required),
        stop: new FormControl(this.placeholder.timeStop, Validators.required)
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
    };
    if (!!this.task) {
      this.firestore.updateFields(this.task.id, log);
    } else {
      this.firestore.addNewLog(log);
    }
    this.form.reset();
  }

  onCancel() {
    this.form.reset();
  }

  private setPlaceholder() {
    let start: Date | firebase.firestore.Timestamp = new Date();
    let stop: string | null = null;
    if (!!this.task) {
      start = (this.task.start as firebase.firestore.Timestamp).toDate();
      stop = (this.task.stop as firebase.firestore.Timestamp).toDate().toLocaleTimeString().slice(0, 5);
    }

    this.placeholder = {
      date: start.toLocaleDateString('fr-CA'),
      timeStart: start.toLocaleTimeString().slice(0, 5),
      timeStop: stop
    };
  }
}
