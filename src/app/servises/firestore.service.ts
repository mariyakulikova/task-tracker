import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {LogTime} from '../interfaces/logTime';
import * as firebase from 'firebase/app';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private database: AngularFirestore,
    private auth: AuthService) {
  }

  converter = {
    toFirestore(log: LogTime): firebase.firestore.DocumentData {
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

  private getDoc(id: string, date: Date): AngularFirestoreDocument<any> {
    return this.database
      .collection('users')
      .doc(`${this.auth.currentUser.uid}`)
      .collection('year-month')
      .doc(`${date.getFullYear()}-${date.getMonth() + 1}`)
      .collection('days')
      .doc(`${date.getDate()}`)
      .collection('tasks')
      .doc(id);
  }

  private getCollection(id: string, date: Date): AngularFirestoreCollection<any> {
    return this.database
      .collection('users')
      .doc(`${this.auth.currentUser.uid}`)
      .collection('year-month')
      .doc(`${date.getFullYear()}-${date.getMonth() + 1}`)
      .collection('days')
      .doc(`${date.getDate()}`)
      .collection('tasks');
  }

  addNewLog(log: LogTime, date: Date): string {
    let id = this.database.createId();
    this.getDoc(id, date).set(this.converter.toFirestore(log));
    return id;
  }

  addStopField(id: string, date: Date) {
    this.getDoc(id, date).update({
      stop: date,
    });
  }

  updatePauseField(id: string, date: Date) {
    this.getDoc(id, date).update({
      pause: firebase.firestore.FieldValue.arrayUnion(date),
    });
  }

  getTasks(userId: string, date: Date): Observable<LogTime[]> {
    return this.getCollection(userId, date).get().pipe(
      map(snapshots => {
        return snapshots.docs
          .map(doc => {
            const task = doc.data();
            return task as LogTime;
          })
          .filter(task => task.hasOwnProperty('stop'));
      }));
  }

  getLog(id: string, date: Date) {
    this.getDoc(id, date).get().subscribe(data => {
      console.log(data.data());
    });
  }
}
