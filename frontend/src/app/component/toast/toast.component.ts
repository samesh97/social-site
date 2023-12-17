import { Component, Input, OnInit } from '@angular/core';
import { Toast } from 'src/app/model/toast.model';

@Component({
  selector: 'toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit
{
  @Input()
  public toasts: Toast[] = [];

  ngOnInit(): void {}
}
