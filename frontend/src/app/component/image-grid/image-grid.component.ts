import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostImage } from 'src/app/model/post-image.model';

@Component({
  selector: 'image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.css']
})
export class ImageGridComponent {

  @Input() postImages: PostImage[] = [];

  @Output() onImageClick = new EventEmitter<PostImage>();

  imageClicked = (postImage: PostImage) => 
  {
    this.onImageClick.emit(postImage);
  }
}
