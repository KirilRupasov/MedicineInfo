import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { MainMenu } from '../mainmenu/mainmenu';
import { Auth, User } from '@ionic/cloud-angular';
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
    if(this.user.get("date_of_birth", 0) != 0) {
      this.date_of_birth = this.user.get("date_of_birth", 0);
    }

    if(this.user.get("gender", 0) != 0) {
      this.gender_value = this.user.get("gender", 0);
    }

    if(this.user.get("smoker", 0) != 0) {
      this.smoker_value = this.user.get("smoker", 0);
    }

    if(this.user.get("add_info", 0) != 0) {
      this.add_info_value = this.user.get("add_info", 0);
    }

    if(!this.auth.isAuthenticated()) {
      this.navCtrl.push(MainMenu);
    }
  }

  public save() {
    if(this.date_of_birth !== "") {
      this.user.set("date_of_birth", this.date_of_birth);
      this.user.save();
    }

    if((this.add_info_value != "") && (this.add_info_value != null)) {
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

    this.navCtrl.push(MyProfile).then(() => {
       // first we find the index of the current view controller:
       const index = this.viewCtrl.index;
       // then we remove it from the navigation stack
       this.navCtrl.remove(index);
     });
  }

}
