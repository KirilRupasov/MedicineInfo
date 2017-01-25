import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { MainMenu } from '../mainmenu/mainmenu';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { AlertController } from 'ionic-angular';

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
      this.navCtrl.push(MainMenu);
    } else {
      this.date_of_birth = this.user.get("date_of_birth", 0);
      if(this.date_of_birth !== 0 && this.date_of_birth != undefined) {
        this.content += "Birthdate: " + this.date_of_birth + "\n";
      }

      this.smoker = this.user.get("smoker", 0);
      if(this.smoker !== 0) {
        this.content += "Smoker: " + this.smoker + '\n';
      }

      this.gender = this.user.get("gender", 0);

      if(this.gender !== 0) {
        this.content += "Gender: " + this.gender + "\n";
      }

      this.add_info = this.user.get("add_info", 0);
      if(this.add_info !== 0) {
        this.content += "Additional: " + this.add_info;
      }
    }
  }

}
