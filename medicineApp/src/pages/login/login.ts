import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Auth, User, UserDetails } from '@ionic/cloud-angular';
import { AlertController } from 'ionic-angular';
import { MainMenu } from '../mainmenu/mainmenu';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  email_value: any;
  password_value: any;

  constructor(private navCtrl: NavController, private viewCtrl: ViewController, public alertCtrl: AlertController, public auth: Auth, public user: User) {
    if(this.auth.isAuthenticated()) {
      this.auth.logout();
      location.reload();
    }
  }

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
