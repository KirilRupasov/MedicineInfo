import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { AlertController } from 'ionic-angular';
import { MainMenu } from '../mainmenu/mainmenu';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})




export class Signup {
  email_value: string;
  password_value: string;
  email_confirm_value: string;
  password_confirm_value: string;


  constructor(private navCtrl: NavController, public alertCtrl: AlertController, public auth: Auth, public user: User, private viewCtrl: ViewController) {

  }



  public register(ev: any) {

    let errors : string = "";


    let details: UserDetails = { 'email': this.email_value, 'password': this.password_value};

    if(this.email_value != this.email_confirm_value) {
      let alert = this.alertCtrl.create({
           title: 'Error!',
           subTitle: "Emails do not match!",
           buttons: ['OK']
         });
       alert.present();
    } else if(this.password_value != this.password_confirm_value) {
      let alert = this.alertCtrl.create({
           title: 'Error!',
           subTitle: "Passwords do not match!",
           buttons: ['OK']
         });
       alert.present();
    } else {
          this.auth.signup(details).then(() => {
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
          }, (err: IDetailedError<string[]>) => {
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
                title: 'Error!',
                subTitle: errors,
                buttons: ['OK']
              });
              alert.present();
              }
            });
          }
    }

 
}

