/**
 * @name MedicineInfo
 * 
 * @description
 * 
 * Logout
 */

import { Component, ViewChild, ElementRef } from '@angular/core';
import { Auth, User} from '@ionic/cloud-angular';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { ReviewModal } from '../reviewModal/reviewModal';
import { ReadReviewsModal } from '../readReviewsModal/readReviewsModal';
import { StoreLocator } from '../storelocator/storelocator';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

declare var google;

@Component({
  selector: 'page-medicineinfo',
  templateUrl: 'medicineinfo.html'
})

export class MedicineInfo {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  private title: string;
  private description: string;
  private side_effects: string;
  private benefits: string;
  private how_does_it: string;
  private elderly: string;
  private stores: string;
  private reviewAction: string;
  private leaveReview: boolean;
  private stars: any[];
  private half_stars: any[];

  /**
   * @param {NavParams} navParams Medicine Parameters
   * @param {Auth} auth Authentication Controller
   * @param {User} user Storage for User data
   * @param {ModalController} modalCtrl Modal Controller
   * @param {Http} http Controller for HTTP back-end requests
   * @param {AlertController} alertCtrl Alert Controller
   * 
   * @description 
   * 
   * The constructor loads the medicine data provided by Navigation Paramaeters
   * and displays it on page. If user is authenticated, additional customized information
   * will might be displayed
   */ 
  constructor(navParams: NavParams, public auth: Auth, public user: User, public modalCtrl: ModalController,
   private http: Http, public alertCtrl: AlertController, private sanitizer: DomSanitizer) {
    this.title = navParams.get("title");

    this.http.get('http://medicineappbackend.me/averagerating/' + this.title).map(res => res).subscribe(
      data => {
        let rating = +data.text().toString() || 0;
        this.stars = new Array(Math.floor(rating));
        if(rating > Math.floor(rating)) {
          this.half_stars = new Array(1);
        }
      }
    );

    this.description = navParams.get("description");
    this.side_effects = navParams.get("side_effects");
    this.benefits = navParams.get("benefits");
    this.how_does_it = navParams.get("how_does_it");
    this.stores = navParams.get("stores");
    this.leaveReview = true;

  

    
    if(this.auth.isAuthenticated()) {
      this.http.get('http://medicineappbackend.me/checkifreviewexists/'+ this.user.details.email + '/' + this.title).map(res => res).subscribe(
        data => {
          if(data.text().toString() == "false") {
            this.reviewAction = "Leave Review";
          } else {
            this.leaveReview = false;
            this.reviewAction = "Edit Review";
          }
        },
        err => {
        }
      );

      let date_of_birth = this.user.get("date_of_birth", 0);
      if(date_of_birth != 0) {
        let parts = date_of_birth.split("-")
        let date = new Date(parts[0], parts[1], parts[2]);
        let ageDif = Date.now() - date.getTime();
        let ageDate = new Date(ageDif);
        let age = Math.abs(ageDate.getUTCFullYear() - 1970);
        if(age > 65 && navParams.get("elderly") != "" && navParams.get("elderly") != null) {
          //if user is authenticated and older than 65 -> display the information for elderly
          this.elderly = '<div class="alert alert-warning card"><div class="card-block"><strong>Elderly patients </strong>' + navParams.get("elderly") + '</div></div>';
        }
      }
    }
  }

  /**
   * @name getTitle
   * @returns title of medicine
   */
  getTitle() {
    return this.title;
  }

  averageRating(ratingNum: number) {
    let rating = "";
    let go = true;
    let x = 0;
    while(go) {
      if(x < ratingNum) {
        rating += '<i class="fa fa-star" aria-hidden="true"></i>';
      } else if(x > (ratingNum-1)) {
        rating += '<i class="fa fa-star-half" aria-hidden="true"></i>';
        go = false;
      } else {
        go = false;
      }         
      x++;
    }

    return rating;
  }

  isLeaveReview() {
    return this.leaveReview;
  }

  submitted() {
    this.leaveReview = false;
    this.reviewAction = "Edit Review";
  }

  /**
   * @name openLeaveReviewModal
   * 
   * @description
   * 
   * This function initally check if user is logged
   * If not -> show Error message
   * Otherwise -> checks if review was already submitted by user
   *    If not -> open Modal to leave review (ReviewModal)
   *    Otherwise -> show Error message
   */
  openLeaveReviewModal() {
    if(this.auth.isAuthenticated()) {
        let modal = this.modalCtrl.create(ReviewModal, {"root" : this });
        modal.present();
    } else {
       let alert = this.alertCtrl.create({
           title: 'Error(s)!',
           subTitle: "You are not logged in!",
           buttons: ['OK']
         });
       alert.present();
    }
  }

  /**
   * @name openReadReviewsModal
   * 
   * @description
   * 
   * opens Modal for reading reviews (ReadReviewsModal)
   */
  openReadReviewsModal() {
    let modal = this.modalCtrl.create(ReadReviewsModal, {"root" : this});
    modal.present();
  }

  /**
   * @name openStoreLocatorModal
   * 
   * @description
   * 
   * opens Modal for locating stores (StoreLocator)
   */
  openStoreLocatorModal() {
    let modal = this.modalCtrl.create(StoreLocator, {"medicine_title" : this.getTitle(), "stores": this.stores});
    modal.present();
  }
}
