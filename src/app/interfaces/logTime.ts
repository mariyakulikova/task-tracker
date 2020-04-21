export interface LogTime {
  name: string;
  start: Date;
  finish?: Date;
  pause?: Date[];
  comment?: string;
}
