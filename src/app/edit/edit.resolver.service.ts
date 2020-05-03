import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {FirestoreService} from '../servises/firestore.service';
import {LogTime} from '../interfaces/logTime';

@Injectable({
  providedIn: 'root'
})
export class EditResolver implements Resolve<any>{

  constructor(private firestore: FirestoreService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LogTime> {
    const id = route.params.id;
    return this.firestore.getLog(id);
  }
}
