import { Pipe, PipeTransform } from '@angular/core';
import * as firebase from 'firebase';

@Pipe({
  name: 'timestampToDate'
})
export class TimestampToDatePipe implements PipeTransform {

  transform(timestamp: firebase.firestore.Timestamp): Date {
    return new Date(timestamp.seconds * 1000);
  }
}
