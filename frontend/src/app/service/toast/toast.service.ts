import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Toast, ToastType } from 'src/app/model/toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService
{
  private toastSubject = new ReplaySubject<Toast>(1);
  constructor() { }

  getToastSubject = () =>
  {
    return this.toastSubject;  
  }
  showToast = (message: string, type: ToastType = ToastType.INFO) =>
  {
    const toast = new Toast(message, type);
    this.toastSubject.next(toast);
  }
}
