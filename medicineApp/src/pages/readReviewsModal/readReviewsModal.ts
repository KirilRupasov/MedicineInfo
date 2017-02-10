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
   medicine_title: string;

   constructor(public user: User, public viewCtrl: ViewController, public params: NavParams, private http: Http) {
    this.reviews = [];
    this.medicine_title = this.params.get('root').getTitle();
    this.loadReviews();
   }

   loadReviews() {
     this.http.get('http://medicineappbackend.me/getreviews/'+ this.medicine_title).map(res => res.json()).subscribe(
        data => {
          if(data != null && data.length) {
          let rating: number;
            for (let review of data) {
               let ratingHTML = "<ion-row>";
               rating = review.rating;

               review.rating_number = [];

                for (let i = 0; i < review.rating; i++) {
                   review.rating_number.push(i);
               }

               for(let i=0; i<3; i++) {
                 ratingHTML += '<ion-col><ion-icon name="star" color="bright"></ion-icon></ion-col>';
               }

               ratingHTML += "</ion-row>";
            }
            this.reviews = data;
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
