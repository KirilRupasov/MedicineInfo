import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { MainMenu } from '../mainmenu/mainmenu';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { AlertController } from 'ionic-angular';
import { MyProfile } from '../myprofile/myprofile';

@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html'
})

export class EditProfile {
  date_of_birth: any;
  add_info_value: any;
  smoker_value: any;
  gender_value: any;

  constructor(private navCtrl: NavController, private viewCtrl: ViewController, public auth: Auth, public user: User) {
    if(!this.auth.isAuthenticated()) {
      this.navCtrl.push(MainMenu);
    }
  }

  public save() {
    if(this.date_of_birth !== "") {
      this.user.set("date_of_birth", this.date_of_birth);
      this.user.save();
    }

    if(this.add_info_value !== "") {
      this.user.set("add_info", this.add_info_value);
      this.user.save();
    }

    if(this.smoker_value !== "") {
      this.user.set("smoker", this.smoker_value);
      this.user.save();
    }

    if(this.gender_value !== "") {
      this.user.set("gender", this.gender_value);
      this.user.save();
    }

    this.navCtrl.push(MyProfile);
  }

}
