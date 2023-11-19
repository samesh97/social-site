import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private progressStateSubject = new ReplaySubject<boolean>(1);
  constructor() { }

  show = () =>
  {
    this.progressStateSubject.next(true);
  }
  hide = () =>
  {
    this.progressStateSubject.next(false);
  }
  getSubject = (): ReplaySubject<boolean> =>
  {
    return this.progressStateSubject;
  }
}
