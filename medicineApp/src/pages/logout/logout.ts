import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';
import { MainMenu } from '../mainmenu/mainmenu';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html'
})
export class Logout {
  email_value: any;
  password_value: any;

  constructor(private navCtrl: NavController, private viewCtrl: ViewController, public auth: Auth, public user: User) {
    if(this.auth.isAuthenticated()) {
      this.auth.logout();
      location.reload();
    }
  }



}
