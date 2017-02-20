import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';
import { EditProfile } from '../editprofile/editprofile';

@Component({
  selector: 'page-myprofile',
  templateUrl: 'myprofile.html'
})
export class MyProfile {
  content: any;
  date_of_birth: any;
  smoker: any;
  gender: any;
  add_info: any;
  password_value: any;

  constructor(private navCtrl: NavController, private viewCtrl: ViewController, public auth: Auth, public user: User) {
    this.content = "";

    if(!this.auth.isAuthenticated()) {
      location.reload();
    } else {
      this.date_of_birth = this.user.get("date_of_birth", 0);
      if(this.date_of_birth !== 0 && this.date_of_birth != undefined) {
        this.content += "Birthdate: " + this.date_of_birth + "<hr>";
      }

      this.smoker = this.user.get("smoker", 0);
      if(this.smoker !== 0) {
        this.content += "Smoker: " + this.smoker + '<hr>';
      }

      this.gender = this.user.get("gender", 0);

      if(this.gender !== 0) {
        this.content += "Gender: " + this.gender + "<hr>";
      }

      this.add_info = this.user.get("add_info", 0);
      if(this.add_info !== 0) {
        this.content += "Additional: " + this.add_info + "<hr>";
      }

      if(this.content == "") {
        this.content = '<strong>Profile is empty.</strong>';
      } else {
        this.content = this.content.substr(0, this.content.length - 4);
      }
    }
  }

  edit() {
    if(!this.auth.isAuthenticated()) {
      location.reload();
    } else {
      this.navCtrl.push(EditProfile);
    }
  }

}
