/**
 * @name MyProfile
 * 
 * @description
 * 
 * My Profile page
 */


import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';
import { EditProfile } from '../editprofile/editprofile';
import { MainMenu } from '../mainmenu/mainmenu';

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

  /**
   * @name constructor
   * @param {NavController} navCtrl Navigation NavController
   * @param {Auth} auth Authentication Controller
   * @param {User} user User Data storage
   * 
   * @description
   * 
   * This method initializes My Profile.
   * If user is authenticated -> get his profile data and show it.
   * Otherwise -> forward to Main Menu.
   */
  constructor(private navCtrl: NavController, private auth: Auth, private user: User) {
    this.content = "";

    if(!this.auth.isAuthenticated()) {
      this.navCtrl.push(MainMenu);
    } else {
      this.date_of_birth = this.user.get("date_of_birth", undefined);
      
      if(this.date_of_birth != undefined) {
        this.content += "Birthdate: " + this.date_of_birth + "<hr>";
      }

      this.smoker = this.user.get("smoker", undefined);
      if(this.smoker != undefined) {
        this.content += "Smoker: " + this.smoker + '<hr>';
      }

      this.gender = this.user.get("gender", 0);

      if(this.gender != undefined) {
        this.content += "Gender: " + this.gender + "<hr>";
      }

      if(this.content == "") {
        this.content = '<strong>Profile is empty.</strong>';
      } else {
        this.content = this.content.substr(0, this.content.length - 4);
      }
    }
  }

  /**
   * @name edit
   * 
   * @description
   * 
   * This method simply forwards user to Edit Profile page after the button was clicked.
   */
  edit() {
    this.navCtrl.push(EditProfile);
  }

}
