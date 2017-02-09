import { Component } from '@angular/core';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { App, ModalController, ViewController, NavController, NavParams, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

@Component({
  templateUrl: 'readReviewsModal.html',
})

export class ReadReviewsModal {
   reviews: string[];
   medicine_title: string'

   constructor(public user: User, public viewCtrl: ViewController, public params: NavParams, private http: Http) {
    this.reviews = [];
    this.medicine_title = this.params.get('root').getTitle();
    loadReviews();
   }

   loadReviews() {
     this.http.get('http://medicineappbackend.me/reviews/'+ this.medicine_title).map(res => res.json()).subscribe(
        data => {
          if(data != null && data.length) {
            for (let review of data) {
               reviews.push('<p>' + review.user_email + ":" + review.review_content + '</p>');
            }
          }
        },
        err => {
            console.log(err);
        }
      );
   }

   dismiss() {
     this.viewCtrl.dismiss();
   }
}
