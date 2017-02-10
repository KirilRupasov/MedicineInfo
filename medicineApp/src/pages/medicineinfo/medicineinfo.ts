import { Component } from '@angular/core';
import { Auth, User} from '@ionic/cloud-angular';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { ReviewModal } from '../reviewModal/reviewModal';
import { ReadReviewsModal } from '../readReviewsModal/readReviewsModal';
import { Http } from '@angular/http';

@Component({
  selector: 'page-medicineinfo',
  templateUrl: 'medicineinfo.html'
})

export class MedicineInfo {
  title: any;
  description: any;
  side_effects: any;
  benefits: any;
  how_does_it: any;
  elderly: any;

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
          this.elderly = '<div class="alert alert-warning card"><div class="card-block"><strong>Elderly patients </strong>' + navParams.get("elderly") + '</div></div>';
        }
      }
    }
  }

  getTitle() {
    return this.title;
  }

  openLeaveReviewModal() {
    if(this.auth.isAuthenticated()) {
      this.http.get('http://medicineappbackend.me/checkifreviewexists/'+ this.user.details.email).map(res => res).subscribe(
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
}
