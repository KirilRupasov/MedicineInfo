
import { Component } from '@angular/core';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { App, ModalController, ViewController, NavController, NavParams, Platform } from 'ionic-angular';

@Component({
  templateUrl: 'reviewModal.html',
})

export class ReviewModal {
   review: string;

   constructor(public user: User, public viewCtrl: ViewController) {
    this.review = "";
   }

   leaveReview() {
    if(this.review && this.review.trim() != "") {
      //store data on backend
      let userEmail = this.user.get("email", 0);

    }
   }

   dismiss() {
     this.viewCtrl.dismiss();
   }
}
