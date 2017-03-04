/**
 * @name Signup
 * 
 * @description
 * 
 * Signup page.
 */
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Auth, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { AlertController } from 'ionic-angular';
import { MainMenu } from '../mainmenu/mainmenu';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class Signup {
  alert: any;
  email_value: string;
  password_value: string;
  email_confirm_value: string;
  password_confirm_value: string;

  /**
   * @name constructor
   * @param {NavController} navCtrl Navigation Controller
   * @param {AlertController} alertCtrl Alert Controller
   * @param {Auth} auth Authentication Controller
   * 
   * @description
   * 
   * Empty constructor
   */
  constructor(private navCtrl: NavController, public alertCtrl: AlertController, public auth: Auth) {

  }


  /**
   * @name register
   * 
   * @description
   * 
   * Firstly, this method checks for if email and password are matching with confirmations.
   * Afterwards, if everything goes well (all fields are provided, email is not taken, email is valid) -> create new user.
   * Otherwise -> display Error message(s)
   */
  public register() {
    let errors : string = "";
    let details: UserDetails = { 'email': this.email_value, 'password': this.password_value};

    if(this.email_value && (this.email_value != this.email_confirm_value)) {
      this.alert = this.alertCtrl.create({
           title: 'Error!',
           subTitle: "Emails do not match!",
           buttons: ['OK']
         });
       this.alert.present();
    } else if(this.password_value && (this.password_value != this.password_confirm_value)) {
      this.alert = this.alertCtrl.create({
           title: 'Error!',
           subTitle: "Passwords do not match!",
           buttons: ['OK']
         });
       this.alert.present();
    } else {
          this.auth.signup(details).then(() => {
            this.auth.login('basic', details).then(() => {
              this.navCtrl.setRoot(MainMenu);
            }, () => {
              this.alert = this.alertCtrl.create({
                  title: 'Error!',
                  subTitle: "Incorrect email/password combination!",
                  buttons: ['OK']
                });
              this.alert.present();
            });
          }, (err: IDetailedError<string[]>) => {
              
              for (let e of err.details) {
                if (e === 'required_password') {
                  errors = "Password is required!";
                } else if (e === 'required_email') {
                  errors = "Email is required!";
                } else if (e === 'conflict_email') {
                  errors = "Email already exists!";
                } else if (e === 'invalid_email') {
                  errors = "Email is invalid!";
                } else {
                  errors = "Unknown error...";
                }
              }

              if(errors != "") {        
                this.alert = this.alertCtrl.create({
                  title: 'Error!',
                  subTitle: errors,
                  buttons: ['OK']
                });
                this.alert.present();
              }
            });
        }
    }

    public getAlert() {
      return this.alert;
    }

    public getAuth() {
      return this.auth;
    }
 
}

