/**
 * @name Logout
 * 
 * @description
 * 
 * Logout page
 */

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Auth } from '@ionic/cloud-angular';
import { MainMenu } from '../mainmenu/mainmenu';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html'
})

export class Logout {
  email_value: any;
  password_value: any;

  /**
   * @name constructor
   * @param {NavController} navCtrl Navigation Controller
   * @param {Auth} auth Authentication Controller
   * 
   * @description
   * 
   * This method initializes page and logs user out if he is authenticated.
   */
  constructor(private navCtrl: NavController, private auth: Auth) {
    if(this.auth.isAuthenticated()) {
      this.auth.logout();
    }
  }

  /**
   * @name ngAfterViewInit
   * 
   * @description
   * 
   * This method is launched once the page is loaded.
   * It forwards users to MainMenu page after he is logged out.
   */
  ngAfterViewInit() {
    this.navCtrl.setRoot(MainMenu);
  }
}
