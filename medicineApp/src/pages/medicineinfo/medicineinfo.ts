import { Component, ViewChild, ElementRef } from '@angular/core';
import { Auth, User} from '@ionic/cloud-angular';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { ReviewModal } from '../reviewModal/reviewModal';
import { ReadReviewsModal } from '../readReviewsModal/readReviewsModal';
import { StoreLocator } from '../storelocator/storelocator';
import { Http } from '@angular/http';

declare var google;

@Component({
  selector: 'page-medicineinfo',
  templateUrl: 'medicineinfo.html'
})

/**
 * This class represents the MedicineInfo page,
 * which is loaded when the medicine is found and data about it is loaded
 * for user display.
 */

export class MedicineInfo {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  private title: string;
  private description: string;
  private side_effects: string;
  private benefits: string;
  private how_does_it: string;
  private elderly: string;

  /**
   * @description 
   * The constructor loads the medicine data provided by Navigation Paramaeters
   * and displays it on page. If user is authenticated, additional customized information
   * will might be displayed
   */
  
  constructor(private navCtrl: NavController, navParams: NavParams, public auth: Auth, public user: User, public modalCtrl: ModalController, private http: Http) {
    this.title = navParams.get("title");
    this.description = navParams.get("description");
    this.side_effects = navParams.get("side_effects");
    this.benefits = navParams.get("benefits");
    this.how_does_it = navParams.get("how_does_it");

    if(this.auth.isAuthenticated()) {
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
   * @returns title 
   */

  getTitle() {
    return this.title;
  }

  openLeaveReviewModal() {
    if(this.auth.isAuthenticated()) {
      this.http.get('http://medicineappbackend.me/checkifreviewexists/'+ this.user.details.email + '/' + this.title).map(res => res).subscribe(
              data => {
                if(data.text().toString() == "false") {
                  let modal = this.modalCtrl.create(ReviewModal, {"root" : this});
                  modal.present();
                } else {
                  alert("You have already reviewed this medicine!");
                }
              },
              err => {
                  console.log(err);
              }
            );

    } else {
      alert("You are not logged in!");
    }
  }

  openReadReviewsModal() {
    let modal = this.modalCtrl.create(ReadReviewsModal, {"root" : this});
    modal.present();
  }

  openStoreLocatorModal() {
    let modal = this.modalCtrl.create(StoreLocator, {"medicine_title" : this.getTitle()});
    modal.present();
  }
}
