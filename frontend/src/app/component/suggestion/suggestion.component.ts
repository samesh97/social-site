import { Component, OnInit } from '@angular/core';
import { Response } from 'src/app/model/response.model';
import { Suggestion } from 'src/app/model/suggestion.model';
import { ToastType } from 'src/app/model/toast.model';
import { ToastService } from 'src/app/service/toast/toast.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggetionComponent implements OnInit
{
  suggestions: Suggestion[] = [];

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ){}
  ngOnInit(): void
  {
    this.userService.getSuggestions()
      .subscribe((data: Response) => {
        if (data.code == 200)
        {
          this.suggestions = data.data;
        }
      });
  }
  itemClicked = (id: string) => {
    this.toastService.showToast('Added friend', ToastType.INFO);
  }
}
