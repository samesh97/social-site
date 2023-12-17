import { Component, Input, OnInit } from '@angular/core';
import { Toast, ToastType } from 'src/app/model/toast.model';

@Component({
  selector: 'toast-item',
  templateUrl: './toast-item.component.html',
  styleUrls: ['./toast-item.component.css']
})
export class ToastItemComponent implements OnInit {

  @Input()
  toast: Toast = new Toast('', ToastType.INFO);

  ngOnInit(): void
  {
    setTimeout(() =>{
      this.toast.isClosed = true;
    }, this.toast.seconds);
  }

  getIcon = (type: ToastType) => {
    switch (type)
    {
      case ToastType.INFO:
        return "✅";
      case ToastType.WARNING:
        return "⚠️";
      case ToastType.ERROR:
        return "⛔";
    }
  }
  closed = (toast: Toast) =>
  {
    this.toast.isClosed = true;
  }
}
