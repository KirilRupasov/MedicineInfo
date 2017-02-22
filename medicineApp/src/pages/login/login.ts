/**
 * @name Login
 * 
 * @description
 * 
 * Login page.
 */

import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Auth, UserDetails } from '@ionic/cloud-angular';
import { AlertController } from 'ionic-angular';
import { MainMenu } from '../mainmenu/mainmenu';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class Login {
  email_value: any;
  password_value: any;

  /**
   * @name constructor
   * @param {NavController} navCtrl Navigation NavController
   * @param {ViewController} viewCtrl View NavController
   * @param {AlertController} alertCtrl Alert NavController
   * @param {Auth} auth Authencation NavController
   * 
   * @description
   * 
   * this method simply check if user is authenticated.
   * If yes -> proceed
   * Otherwise -> log him out
   */
  constructor(private navCtrl: NavController, private viewCtrl: ViewController, private alertCtrl: AlertController, private auth: Auth) {
    if(this.auth.isAuthenticated()) {
      this.auth.logout();
    }
  }


  /**
   * @name login
   * @param {any} ev event that launches this function
   * 
   * @description
   * 
   * This method checks user's email/password.
   * If those are correct -> login and forward user to MainMenu page,
   * Otherwise -> show Error message.
   */
  public login(ev: any) {
    let details: UserDetails = {'email': this.email_value, 'password': this.password_value};

    this.auth.login('basic', details).then(() => {
      this.navCtrl.setRoot(MainMenu);
    }, () => {
      let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: "Incorrect email/password combination!",
          buttons: ['OK']
        });
      alert.present();
    });
  }
}
