import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.css'],
})
export class FriendRequestComponent implements OnInit {
  suggestions: any[] = [];

  ngOnInit(): void {
    this.suggestions.push({ firstname: 'Samesh', lastname: 'Alahakoon', mutual: '153' })
    this.suggestions.push({
      firstname: 'Pamosha',
      lastname: 'Wijesekera',
      mutual: '3',
    });
    this.suggestions.push({
      firstname: 'Shelani',
      lastname: 'Wijesekera',
      mutual: '10',
    });
  }
}
