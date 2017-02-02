import { Component } from '@angular/core';

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

  constructor(private navCtrl: NavController, navParams: NavParams) {
    this.title = navParams.get("title");
    this.description = navParams.get("description");
    this.side_effects = navParams.get("side_effects");
  }
}
