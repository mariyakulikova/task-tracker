import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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
  timeValidatorMessage = 'Start time cannot be latter then stop';
  // private taskSubject: Subject<LogTime> = new Subject();

  constructor(
    private firestore: FirestoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data.task !== undefined) {
      console.log('ngOnInit activatedRoute.snapshot.data: ', this.activatedRoute.snapshot.data.task);
      this.task = this.activatedRoute.snapshot.data.task as LogTime;
      this.title = 'Edit log time';
    }
    console.log('ngOnInit task: ', this.task);
    this.setupPlaceholder();
    this.form = new FormGroup({
        name: new FormControl(this.task ? this.task.name : null, Validators.required),
        note: new FormControl(this.task ? this.task.comment : null),
        date: new FormControl(this.placeholder.date,
          [Validators.required, EditValidator.dateValidator]),
        start: new FormControl(this.placeholder.timeStart,
          [Validators.required, EditValidator.startValidator(this.task)]),
        stop: new FormControl(this.placeholder.timeStop,
          [Validators.required, EditValidator.stopValidator(this.task)])
      }, [EditValidator.timeValidator]
    );
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log(this.form.get('start').errors, this.form.get('stop').errors);
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
    this.router.navigate(['/calendar'], {state: {data: log.start}});
  }

  onCancel() {
    this.form.reset();
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

  showStartValidatorMessage() {
    return `Start time cannot be latter then ${(this.task.pause[0] as firebase.firestore.Timestamp).toDate().toLocaleTimeString().slice(0, 5)}`;
  }

  showStopValidatorMessage() {
    const p = (this.task.pause[this.task.pause.length - 1] as firebase.firestore.Timestamp).toDate();
    const stop = (this.task.stop as firebase.firestore.Timestamp).toDate();
    if (p === stop) {
      return `Stop time cannot be earlier then ${(this.task.pause[this.task.pause.length - 2] as firebase.firestore.Timestamp).toDate().toLocaleTimeString().slice(0, 5)}`;
    } else {
      return `Stop time cannot be earlier then ${p.toLocaleTimeString().slice(0, 5)}`;
    }
  }
}
