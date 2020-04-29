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

  constructor(
    private firestore: FirestoreService,
    private timer: TimerService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      note: new FormControl(null),
      date: new FormControl(this.getDatePlaceholder(),
        Validators.required),
      start: new FormControl(this.getTimePlaceholder(), Validators.required),
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
    console.log(this.form.value);
    this.form.reset();
  }

  onCancel() {
    this.form.reset();
  }

  private getDatePlaceholder(): string {
    return new Date().toLocaleDateString('fr-CA');
  }

  private getTimePlaceholder(): string {
    return new Date().toLocaleTimeString().slice(0, 5);
  }
}
