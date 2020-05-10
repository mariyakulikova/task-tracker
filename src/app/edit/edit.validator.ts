import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {LogTime} from '../interfaces/logTime';
import * as firebase from 'firebase';

export class EditValidator {

  static startValidator(task: LogTime): ValidatorFn {
    return (currentControl: AbstractControl): ValidationErrors | null => {
      const p = (task.pause[0] as firebase.firestore.Timestamp).toDate();
      const value = currentControl.value.split(':');
      const start = (task.start as firebase.firestore.Timestamp).toDate();
      start.setHours(value[0], value[1]);
      if (start > p) {
        return {
          startError: {
            startValidator: true,
            pause: p.toLocaleTimeString().slice(0, 5)
          }
        };
      }
      return null;
    };
  }

  static stopValidator(task: LogTime | null): ValidatorFn {
    return (currentControl: AbstractControl): ValidationErrors | null => {
      const p = (task.pause[task.pause.length - 1] as firebase.firestore.Timestamp).toDate();
      const value = currentControl.value.split(':');
      const stop = (task.stop as firebase.firestore.Timestamp).toDate();
      stop.setHours(value[0], value[1]);
      if (stop === p) {
        if (stop < (task.pause[task.pause.length - 2] as Date)) {
          return {
            stopError: {
              stopValidator: true,
              pause: (task.pause[task.pause.length - 2] as Date).toLocaleTimeString().slice(0, 5)
            }
          };
        }
      }
      if (stop < p) {
        return {
          stopError: {
            stopValidator: true,
            pause: p.toLocaleTimeString().slice(0, 5)
          }
        };
      }
      return null;
    };
  }

  static dateValidator(control: FormControl): { [key: string]: boolean } {
    if (control.value !== undefined) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const value = control.value.split('-');
      const date = new Date(value[0], value[1] - 1, value[2]);
      date.setHours(0, 0, 0, 0);
      if (date > now) {
        return {
          dateValidator: true
        };
      }
    }
    return null;
  }

  static timeValidator(group: FormGroup): { [key: string]: boolean } {
    const start = new Date(group.value.date.concat('T', group.value.start));
    const stop = new Date(group.value.date.concat('T', group.value.stop));
    if (start > stop) {
      return {
        timeValidator: true
      };
    }
    return null;
  }
}
