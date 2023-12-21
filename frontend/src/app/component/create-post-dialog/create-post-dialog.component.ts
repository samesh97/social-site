import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'create-post-dialog',
  templateUrl: './create-post-dialog.component.html',
  styleUrls: ['./create-post-dialog.component.css'],
})
export class CreatePostDialogComponent {
  constructor(private matDialog: MatDialog) {}
}

