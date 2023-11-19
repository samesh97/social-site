import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { JourneyManagerService } from 'src/app/service/journey-manager/journey-manager.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit
{
  constructor(private userService: UserService, private journeyManager: JourneyManagerService ){}
  private profilePicFile: any;
  registerFormGroup: FormGroup = new FormGroup({});
  ngOnInit(): void
  {
    this.registerFormGroup = new FormGroup({
      email: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl()
    });
  }
  formSubmitted = () =>
  {
    if (this.registerFormGroup.valid && this.profilePicFile )
    {
      const formData = new FormData();
      formData.append("profilePic", this.profilePicFile);
      formData.append("email", this.registerFormGroup.value.email);
      formData.append("firstName", this.registerFormGroup.value.firstName);
      formData.append("lastName", this.registerFormGroup.value.lastName);
      formData.append("password", this.registerFormGroup.value.password);

      this.userService.register(formData).subscribe(data => {
        this.journeyManager.loadLogin();
      });
    }
  }
  imageSelected = (event: any) =>
  {
    if (event.target.files && event.target.files[0])
    {
      this.profilePicFile = event.target.files[0];
    }
  }
  
}
