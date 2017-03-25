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
import { SessionService } from '../../providers/session.service';

@Component({
  templateUrl: 'reviewModal.html',
    providers: [
    { provide: 'SessionService', useClass: SessionService }
  ]
})

export class ReviewModal {
   review: string;
   rating: number;
   user_email: string;
   medicine_name: string;
   leave_review: boolean;
   alert: any;

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
     private navCtrl: NavController, private sessionService: SessionService
    ) {
    if(!this.auth.isAuthenticated()) {
      this.navCtrl.push(MainMenu);
    } else {
      this.leave_review = this.params.get("root").isLeaveReview();
      this.medicine_name = this.params.get("root").getTitle();
      this.user_email = this.user.details.email;

      if(this.leave_review) {
        this.review = "";
        this.rating = 1;
      } else {
        this.http.get('http://medicineappbackend.me/getreview/' + this.user_email + "/"+ this.medicine_name).map(res => res.json()).subscribe(
          data => {
            this.rating = data.rating;
            this.review = data.review_content;
          },
          err => {
          }
        );
      }   
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
    if(this.review && this.review.trim() != "" && this.review.length < 601) {
      //store data on backend
      let review_content = this.review;
      let rating = this.rating;
      let user_email = this.user_email;
      let medicine_name = this.medicine_name;
      let session_id = this.sessionService.id;

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      let url = 'http://medicineappbackend.me/storereview';

      if(!this.leave_review) {
        url =   'http://medicineappbackend.me/editreview';
      }

      this.http.post(url, { user_email, medicine_name, review_content, rating, session_id }, options).subscribe(data => {
        this.alert = this.alertCtrl.create({
                title: data.text().toString(),
                subTitle: "Review submitted!",
                buttons: ['OK']
              });
        this.alert.present();
        this.params.get("root").submitted();
        this.params.get("root").setRating();
        this.dismiss();
       }, error => {
           console.log(JSON.stringify(error.json()));
       });
    } else if(this.review.length > 600) {
        this.alert = this.alertCtrl.create({
            title: 'Error(s)!',
            subTitle: "Review is longer than 600 characters!",
            buttons: ['OK']
          });
        this.alert.present();
    } else {
       this.alert = this.alertCtrl.create({
            title: 'Error(s)!',
            subTitle: "No review is written!",
            buttons: ['OK']
          });
        this.alert.present();
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

   /**
    * @name getAlert
    * 
    * @description
    *
    * return alert
    */
   getAlert() {
     return this.alert;
   }
}
