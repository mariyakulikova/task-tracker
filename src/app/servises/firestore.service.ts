import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {LogTime} from '../interfaces/logTime';
import * as firebase from 'firebase/app';
// import 'firebase/<PACKAGE>';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private database: AngularFirestore) {
  }

  converter = {
    toFirestore: (log: LogTime) => {
      if (log.comment !== '') {
        return {
          name: log.name,
          start: log.start,
        };
      } else {
        return {
          name: log.name,
          start: log.start,
          comment: log.comment,
        };
      }
    },
  };

  addNewLog(log: LogTime, date: Date): string {
    let id = this.database.createId();
    this.database
      .collection<any>('year-month')
      .doc(`${date.getFullYear()}-${date.getMonth() + 1}`)
      .collection('days')
      .doc(`${date.getDate()}`)
      .collection('tasks')
      .doc(id)
      .set(this.converter.toFirestore(log));
    return id;
  }

  addStopField(id: string, date: Date) {
    this.database
      .collection<any>('year-month')
      .doc(`${date.getFullYear()}-${date.getMonth() + 1}`)
      .collection('days')
      .doc(`${date.getDate()}`)
      .collection('tasks')
      .doc(id)
      .update({
        stop: date,
      });
  }

  updatePauseField(id: string, date: Date) {
    this.database
      .collection<any>('year-month')
      .doc(`${date.getFullYear()}-${date.getMonth() + 1}`)
      .collection('days')
      .doc(`${date.getDate()}`)
      .collection('tasks')
      .doc(id)
      .update({
        pause: firebase.firestore.FieldValue.arrayUnion(date),
      });
  }

  getLog(date: Date) {
    this.database
      .collection('year-month')
      .doc(`${date.getFullYear()}-${date.getMonth() + 1}`)
      .collection('days')
      .doc(`${date.getDate()}`)
      .get().subscribe(data => {
      console.log(data.data());
    });
  }
}
