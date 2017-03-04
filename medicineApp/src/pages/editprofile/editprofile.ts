/**
 * @name EditProfile
 * 
 * @description
 * 
 * Edit Profile page.
 */

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MainMenu } from '../mainmenu/mainmenu';
import { Auth, User } from '@ionic/cloud-angular';
import { MyProfile } from '../myprofile/myprofile';

@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html'
})

export class EditProfile {
  date_of_birth: any;
  smoker_value: any;
  gender_value: any;

  /**
   * @name constructor
   * @param navCtrl Navigation NavController
   * @param auth Authentication Controller
   * @param user Storage ofr user data
   * 
   * @description
   * 
   * Intializes the page with User Profile values. 
   * If user is not authenticated -> forward him to MainMenu
   */
  constructor(private navCtrl: NavController, private auth: Auth, private user: User) {
    if(this.user.get("date_of_birth", undefined) != undefined) {
      this.date_of_birth = this.user.get("date_of_birth", undefined);
    }
  
    if(this.user.get("gender", undefined) != undefined) {
      this.gender_value = this.user.get("gender", undefined);
    }

    if(this.user.get("smoker", 0) != undefined) {
      this.smoker_value = this.user.get("smoker", undefined);
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

  public getUser() {
    return this.user;
  }
}
