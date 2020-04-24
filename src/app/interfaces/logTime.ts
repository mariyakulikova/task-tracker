import * as firebase from 'firebase';

export interface LogTime {
  name: string;
  start: Date | firebase.firestore.Timestamp;
  stop?: Date | firebase.firestore.Timestamp;
  pause?: Date[];
  duration?: Date;
  comment?: string;
}
