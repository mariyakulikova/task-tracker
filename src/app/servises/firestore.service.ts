import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {LogTime} from '../interfaces/logTime';
import * as firebase from 'firebase/app';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {UtilityService} from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    private utility: UtilityService) {
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

  private getDoc(id: string): AngularFirestoreDocument<any> {
    return this.firestore
      .collection('users')
      .doc(`${this.auth.currentUser.uid}`)
      .collection('tasks')
      .doc(id);
  }

  private getCollection(date: Date): AngularFirestoreCollection<any> {
    return this.firestore
      .collection('users')
      .doc(`${this.auth.currentUser.uid}`)
      .collection('tasks', ref => ref
        .where('start', '>=', date)
        .where('start', '<', new Date(date.setDate(date.getDate() + 1)))
        .orderBy('start'));
  }

  addNewLog(log: LogTime): Promise<string> {
    const id = this.firestore.createId();
    return this.getDoc(id).set(this.converter(log)).then(r => id);
  }

  updateFields(id: string, data: any): Promise<void> {
    return this.getDoc(id).update(data);
  }

  addStopField(id: string, date: Date): Promise<void> {
    return this.getDoc(id).update({
      stop: date,
    });
  }

  updatePauseField(id: string, date: Date): Promise<void> {
    return this.getDoc(id).update({
      pause: firebase.firestore.FieldValue.arrayUnion(date),
    });
  }

  getTasks(date: Date): Observable<LogTime[]> {
    return this.getCollection(date).get().pipe(
      map(snapshots => {
        return snapshots.docs
          .map(doc => {
            const task = doc.data();
            Object.assign(task, {id: doc.id});
            return task as LogTime;
          })
          .filter(task => task.hasOwnProperty('stop'))
          .map(task => {
            return this.utility.countDuration(task);
          });
      }));
  }

  getLog(id: string): Observable<LogTime> {
    return this.getDoc(id).get().pipe(
      map(snapshot => {
        const task = snapshot.data();
        Object.assign(task, {id: snapshot.id});
        return task as LogTime;
      })
    );
  }

  deleteLog(id: string): Promise<void> {
    return this.getDoc(id).delete();
  }
}
