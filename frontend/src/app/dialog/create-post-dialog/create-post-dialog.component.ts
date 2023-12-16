import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'create-post-dialog',
  templateUrl: './create-post-dialog.component.html',
  styleUrls: ['./create-post-dialog.component.css'],
})
export class CreatePostDialogComponent {
  constructor(private matDialog: MatDialog) {}

  hello1 = (): Observable<number> => {
    return of(1, 2, 3, 4, 5);
  };
  hello2 = (): Observable<number> => {
    return this.hello1().pipe(
      map(item => {
        return item + 30;
      },
      tap(console.log)
      ));
  };
}

