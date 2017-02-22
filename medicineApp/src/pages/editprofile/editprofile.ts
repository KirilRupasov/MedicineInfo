/**
 * @name EditProfile
 * 
 * @description
 * 
 * Edit Profile page.
 */

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

  /**
   * @name constructor
   * @param navCtrl Navigation NavController
   * @param viewCtrl View Controller
   * @param auth Authentication Controller
   * @param user Storage ofr user data
   * 
   * @description
   * 
   * Intializes the page with User Profile values. 
   * If user is not authenticated -> forward him to MainMenu
   */
  constructor(private navCtrl: NavController, private viewCtrl: ViewController, private auth: Auth, private user: User) {
    if(this.user.get("date_of_birth", 0) != 0) {
      this.date_of_birth = this.user.get("date_of_birth", 0);
    }

    if(this.user.get("gender", 0) != 0) {
      this.gender_value = this.user.get("gender", 0);
    }

    if(this.user.get("smoker", 0) != 0) {
      this.smoker_value = this.user.get("smoker", 0);
    }

    if(!this.auth.isAuthenticated()) {
      this.navCtrl.push(MainMenu);
    }
  }

  /**
   * @name save
   * 
   * @description
   * 
   * Saves new values provided by user and transfers him to MyProfile page.
   */
  public save() {
    if(this.date_of_birth !== "") {
      this.user.set("date_of_birth", this.date_of_birth);
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
