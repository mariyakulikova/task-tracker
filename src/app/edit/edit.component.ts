import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirestoreService} from '../servises/firestore.service';
import {LogTime} from '../interfaces/logTime';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase';
import {EditValidator} from './edit.validator';

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
  task: LogTime = null;
  placeholder: Placeholder;
  title = 'Add log time';

  constructor(
    private firestore: FirestoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data.task !== undefined) {
      this.task = this.activatedRoute.snapshot.data.task as LogTime;
      this.title = 'Edit log time';
    }
    this.setupPlaceholder();
    this.form = this.fb.group({
      name: [this.task ? this.task.name : null, [
        Validators.required
      ]],
      note: [this.task ? this.task.comment : null],
      date: [this.placeholder.date, [
        Validators.required,
        EditValidator.dateValidator
      ]],
      start: [this.placeholder.timeStart, [
        Validators.required
      ]],
      stop: [this.placeholder.timeStop, [
        Validators.required
      ]]
    });
    this.form.setValidators(EditValidator.timeValidator);

    if (!!this.task && !!this.task.pause) {
      this.form.get('start').setValidators(EditValidator.startValidator(this.task));
      this.form.get('stop').setValidators(EditValidator.stopValidator(this.task));
    }
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

    const promise: Promise<any> = !!this.task ? this.firestore.updateFields(this.task.id, log) : this.firestore.addNewLog(log);
    promise.then(r => this.router.navigate(['/calendar'], {state: {data: log.start}}));
  }

  onCancel() {
    this.router.navigate(['/calendar']);
  }

  private setupPlaceholder() {
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

  ifControlInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (control.invalid && control.touched);
  }

  ifFormInvalid(): boolean {
    return this.form.touched && this.form.hasError('timeValidator');
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.form.get(controlName).hasError(errorName);
  }

  getPauseForStartError(): string {
    return this.form.get('start').errors?.startError.pause;
  }

  getPauseForStopError(): boolean {
    return this.form.get('stop').errors?.stopError.pause;
  }
}
