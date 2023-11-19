import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.css']
})
export class ImageGridComponent {

  @Input() images: any[] = [1, 2,3,4,5,6];
}
