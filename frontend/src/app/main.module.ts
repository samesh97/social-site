import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './component/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from './service/auth/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TimelineComponent } from './component/timeline/timeline.component';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './component/main/main.component';
import { FriendRequestComponent } from './component/friend-request/friend-request.component';
import { FriendRequestItemComponent } from './component/friend-request-item/friend-request-item.component';
import { CreatePostComponent } from './component/create-post/create-post.component';
import { UserPostComponent } from './component/user-post/user-post.component';
import { AuthInterceptorService } from './interceptor/auth-interceptor.service';
import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';
import { FormsModule } from '@angular/forms';
import { PostService } from './service/post/post.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { CreatePostDialogComponent } from './dialog/create-post-dialog/create-post-dialog.component';

const routes: Routes = [
  { path: '', component: TimelineComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
];

@NgModule({
  declarations:
    [
      LoginComponent,
      TimelineComponent,
      MainComponent,
      FriendRequestComponent,
      FriendRequestItemComponent,
      CreatePostComponent,
      UserPostComponent,
      CreatePostDialogComponent
    ],
  imports:
    [
      BrowserModule,
      CommonModule,
      HttpClientModule,
      RouterModule.forRoot(routes),
      RouterModule,
      FormsModule,
      NoopAnimationsModule,
      MatDialogModule
    ],
  bootstrap: [ MainComponent ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    AuthService,
    PostService
  ],
  exports: [RouterModule],
})
export class MainModule {}