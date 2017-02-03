import { Component } from '@angular/core';
import { Auth, User} from '@ionic/cloud-angular';
import { NavController, NavParams } from 'ionic-angular';

import {
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapsLatLng,
 CameraPosition,
 GoogleMapsMarkerOptions,
 GoogleMapsMarker
} from 'ionic-native';



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

  constructor(private navCtrl: NavController, navParams: NavParams, public auth: Auth, public user: User) {
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
        if(age > 65) {
          this.elderly = navParams.get("elderly");
        }
      }
    }
  }
}
