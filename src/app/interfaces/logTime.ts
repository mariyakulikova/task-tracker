import * as firebase from 'firebase';

export interface LogTime {
  id?: string;
  name: string;
  start: Date | firebase.firestore.Timestamp;
  stop?: Date | firebase.firestore.Timestamp;
  pause?: Date[];
  duration?: Date;
  comment?: string;
}
