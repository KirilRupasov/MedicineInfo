
import { Component } from '@angular/core';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { App, ModalController, ViewController, NavController, NavParams, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

@Component({
  templateUrl: 'reviewModal.html',
})

export class ReviewModal {
   review: string;
   rating: number;

   constructor(public user: User, public viewCtrl: ViewController, public params: NavParams, private http: Http) {
    this.review = "";
    this.rating = 1;
   }

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
             alert('ok');
       }, error => {
           console.log(JSON.stringify(error.json()));
       });
    }
   }

   dismiss() {
     this.viewCtrl.dismiss();
   }
}
