
import { Component } from '@angular/core';
import { Auth, User } from '@ionic/cloud-angular';
import { ViewController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'reviewModal.html',
})

export class ReviewModal {
   review: string;
   rating: number;

   constructor(public user: User, public viewCtrl: ViewController, public params: NavParams, private http: Http, public auth: Auth, public alertCtrl: AlertController) {
    if(!this.auth.isAuthenticated()) {
      location.reload();
    } else {
      this.review = "";
      this.rating = 1;
    }
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
              let alert = this.alertCtrl.create({
                      title: 'Error(s)!',
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

   dismiss() {
     this.viewCtrl.dismiss();
   }
}
