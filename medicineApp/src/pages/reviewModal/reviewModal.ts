/**
 * @name ReviewModal
 * 
 * @description
 * 
 * Modal for leaving Review 
 */

import { Component } from '@angular/core';
import { Auth, User } from '@ionic/cloud-angular';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { MainMenu } from '../mainmenu/mainmenu';

@Component({
  templateUrl: 'reviewModal.html',
})

export class ReviewModal {
   review: string;
   rating: number;

   /**
    * @name constructor
    * @param {User} user User Data storage
    * @param {ViewController} viewCtrl View Controller
    * @param {NavParams} navParams Navigation Parameters, used for getting medicine title
    * @param {Http} http HTTP Request Handler
    * @param {Auth} auth Authentication Controller
    * @param {AlertController} alertCtrl Alert Controller
    * @param {NavController} navCtrl Navigation Controller
    *
    * @description
    *
    * If user authenticated -> this function initializes Modal for leaving reviews,
    * Otherwise -> forward him to Main Menu
    */ 
   constructor(
     private user: User, private viewCtrl: ViewController,
     private params: NavParams, private http: Http,
     private auth: Auth, private alertCtrl: AlertController,
     private navCtrl: NavController
    ) {
    if(!this.auth.isAuthenticated()) {
      this.navCtrl.push(MainMenu);
    } else {
      this.review = "";
      this.rating = 1;
    }
   }

   /**
    * @name leaveReview
    *
    * @description
    *
    * using HTTP requests this function validates and sends review to back-end
    * If Review is written -> write appropriate message and close Modal
    * Otherwise -> Output error message 
    */
   leaveReview() {
    if(this.review && this.review.trim() != "") {
      //store data on backend
      let user_email = this.user.details.email;
      let medicine_name = this.params.get('root').getTitle();
      let review_content = this.review;
      let rating = this.rating;

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      this.http.post(
      'http://medicineappbackend.me/storereview',
       { user_email, medicine_name, review_content, rating },
       options).subscribe(data => {
              let alert = this.alertCtrl.create({
                      title: 'Success!',
                      subTitle: "Review submitted!",
                      buttons: ['OK']
                    });
                  alert.present();
             this.dismiss();
       }, error => {
           console.log(JSON.stringify(error.json()));
       });
    } else {
       let alert = this.alertCtrl.create({
            title: 'Error(s)!',
            subTitle: "No review is written!",
            buttons: ['OK']
          });
        alert.present();
    }
   }

   /**
    * @description
    *
    * Closes Modal.
    */
   dismiss() {
     this.viewCtrl.dismiss();
   }
}
