import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../configuration/common.conf';
import { Response } from 'src/app/model/response.model';
import { Observable } from 'rxjs';
import { Reaction } from 'src/app/model/reaction.model';
import { Comment } from 'src/app/model/comment.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private POST_URL = `${config.SERVER_BASE_URL}/posts`;
  private REACT_URL = `${config.SERVER_BASE_URL}/reactions`;
  private COMMENT_URL = `${config.SERVER_BASE_URL}/comments`;

  constructor(private http: HttpClient) {}

  loadPosts = (): Observable<Response> => {
    return this.http.get<Response>(this.POST_URL, { withCredentials: true });
  };
  createPost = (post: FormData) => {
    return this.http.post<Response>(this.POST_URL, post, {
      withCredentials: true,
    });
  };
  react = (reaction: Reaction) => {
    return this.http.post<Response>(this.REACT_URL, reaction, {
      withCredentials: true,
    });
  };
  comment = (comment: Comment) => {
    return this.http.post<Response>(this.COMMENT_URL, comment, {
      withCredentials: true
    });
  }
  loadComments = (postId: string) => {
    return this.http.get<Response>(`${this.COMMENT_URL}/${postId}`);
  }
}
