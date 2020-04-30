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

  converter(log: LogTime) {
    const logObj = {
      name: log.name,
      start: log.start,
    };
    if (log.comment !== '') {
      Object.assign(logObj, {comment: log.comment});
    }
    if (log.stop) {
      Object.assign(logObj, {stop: log.stop});
    }
    return logObj;
  }

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
    const id = this.database.createId();
    this.getDoc(id, date).set(this.converter(log));
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
            Object.assign(task, {id: doc.id});
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
