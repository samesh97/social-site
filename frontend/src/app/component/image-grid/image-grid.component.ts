import { Component, Input } from '@angular/core';
import { PostImage } from 'src/app/model/post-image.model';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.css']
})
export class ImageGridComponent {

  @Input() postImages: PostImage[] = [];
}
