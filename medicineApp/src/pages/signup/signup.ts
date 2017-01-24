import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { MainMenu } from '../mainmenu/mainmenu';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})




export class Signup {
  email_value: any;
  username_value: any;
  password_value: any;

  constructor(private navCtrl: NavController, public alertCtrl: AlertController, public auth: Auth, public user: User) {

  }



  public register(ev: any) {

    let errors : string = "";


    let details: UserDetails = { 'username' : this.username_value, 'email': this.email_value, 'password': this.password_value};

    this.auth.signup(details).then(() => {
        alert("success");
        this.navCtrl.push(MainMenu);
    }, (err: IDetailedError<string[]>) => {
      alert("fail");
      for (let e of err.details) {
        if (e === 'required_password') {
          errors = "Password is required!<br>";
        } else if (e === 'required_email') {
          errors = "Email is required!<br>";
        } else if (e === 'conflict_email') {
          errors = "Email already exists!<br>";
        } else if (e === 'invalid_email') {
          errors = "Email is invalid!<br>";
        } else if (e === 'conflict_username') {
          errors = "Username is taken!<br>";
        } else {
          errors = "Unknown error...<br>";
        }
      }

      if(errors != "") {
       let alert = this.alertCtrl.create({
           title: 'Error(s)!',
           subTitle: errors,
           buttons: ['OK']
         });
       alert.present();
      }
    });
  }
}

