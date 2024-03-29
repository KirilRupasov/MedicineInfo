/**
 * @name ReadReviewsModal
 * 
 * @description
 * 
 * Modal for reading reviews
 */

import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  templateUrl: 'readReviewsModal.html',
})

export class ReadReviewsModal {
   reviews: any[];
   medicine_title: string;
   no_reviews: string;

   /**
    * @name constructor
    * @param {ViewController} viewCtrl View Controller
    * @param {NavParams} navParams Navigation parameters, which have the title of medicine
    * @param {Http} http HTTP Request handler, to communicate with back-end
    *
    * @description 
    *
    * This constructor creates modal and loads Reviews for specific medicine
    */
   constructor(private viewCtrl: ViewController, private params: NavParams, private http: Http) {
    this.reviews = [];
    this.medicine_title = this.params.get('root').getTitle();
    this.loadReviews();
   }

   /**
    * @name loadReviews
    * 
    * @description
    *
    * This function loads reviews from back-end, by using medicine title and user email.
    */
   loadReviews() {
     this.http.get('http://medicineappbackend.me/getreviews/'+ this.medicine_title).map(res => res.json()).subscribe(
        data => {
          if(data != null && data.length > 0) {
            this.reviews = data;
            for (let review of data) {
               review.rating_number = [];

                for (let i = 0; i < review.rating; i++) {
                  review.rating_number.push(i);
               }
            }
            this.no_reviews = "";
          } else {
            this.no_reviews = "This medicine has no reviews yet.";
          }
        },
        err => {
            console.log(err);
        }
      );
   }

   /**
    * @description
    *
    * closes modal
    */
   dismiss() {
     this.viewCtrl.dismiss();
   }
}
