import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { PostService } from '../../service/post/post.service';
import { Response } from '../../model/response.model';

@Injectable({
  providedIn: 'root'
})
export class TimelinePostResolver implements Resolve<Response>
{
  constructor(
    private postService: PostService
  )
  { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Response>
  {
      return this.postService.loadPosts();
  }
}
