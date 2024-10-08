import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './component/pages/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from './service/auth/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TimelineComponent } from './component/pages/timeline/timeline.component';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInComponent } from './component/logged-in/logged-in.component';
import { FriendRequestComponent } from './component/friend-request/friend-request.component';
import { CreatePostComponent } from './component/create-post/create-post.component';
import { UserPostComponent } from './component/user-post/user-post.component';
import { AuthInterceptorService } from './interceptor/auth-interceptor.service';
import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';
import { FormsModule } from '@angular/forms';
import { PostService } from './service/post/post.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { CreatePostDialogComponent } from './component/create-post-dialog/create-post-dialog.component';
import { ProfileSearchComponent } from './component/profile-search/profile-search.component';
import { ProfileViewComponent } from './component/pages/profile-view/profile-view.component';
import { RegisterComponent } from './component/pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageGridComponent } from './component/image-grid/image-grid.component';
import { ProgressBarComponent } from './component/progress-bar/progress-bar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserPostInteractionComponent } from './component/user-post-interaction/user-post-interaction.component';
import { LocalDatePipe } from './pipe/local-date/local-date.pipe';
import { SuggetionComponent } from './component/views/suggestion/suggestion.component';
import { CardItemComponent } from './component/core/card-item/card-item.component';
import { ToastComponent } from './component/toast/toast.component';
import { ToastItemComponent } from './component/toast-item/toast-item.component';
import { NotificationComponent } from './component/views/notification/notification.component';
import { InitComponent } from './component/init/init.component';
import { CountPipe } from './pipe/count/count.pipe';
import { ProfileOptionsComponent } from './component/views/profile-options/profile-options.component';
import { ClickEventDirective } from './directive/click-event/click-event.directive';
import { ExpandableViewComponent } from './component/core/expandable-view/expandable-view.component';
import { CommonRowItemComponent } from './component/core/common-row-item/common-row-item.component';
import { ActionRowItemComponent } from './component/core/action-row-item/action-row-item.component';
import { PostResolver } from './resolver/post-resolver/post.resolver';
import { ContainerComponent } from './component/core/container/container.component';

const routes: Routes =
[
  {
    path: '',
    component: TimelineComponent,
    canActivate: [AuthGuard],
    resolve: { posts: PostResolver }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'profile',
    component: ProfileViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  declarations:
    [
      LoginComponent,
      TimelineComponent,
      LoggedInComponent,
      FriendRequestComponent,
      ActionRowItemComponent,
      CreatePostComponent,
      UserPostComponent,
      CreatePostDialogComponent,
      ProfileSearchComponent,
      ProfileViewComponent,
      RegisterComponent,
      ImageGridComponent,
      ProgressBarComponent,
      UserPostInteractionComponent,
      LocalDatePipe,
      SuggetionComponent,
      CardItemComponent,
      ToastComponent,
      ToastItemComponent,
      NotificationComponent,
      InitComponent,
      CountPipe,
      ProfileOptionsComponent,
      ClickEventDirective,
      ExpandableViewComponent,
      CommonRowItemComponent,
      ContainerComponent,
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
      MatDialogModule,
      ReactiveFormsModule,
      MatProgressSpinnerModule,
      BrowserAnimationsModule
    ],
  bootstrap: [ InitComponent ],
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
