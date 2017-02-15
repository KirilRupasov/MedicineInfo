import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
 
declare var google;

@Component({
  templateUrl: 'storelocator.html'
})

export class StoreLocator {
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  medicine_title: string;
 
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public params: NavParams) {
    this.medicine_title = this.params.get('medicine_title');
  }
 
  ngAfterViewInit() {
    this.loadMap();
  }
 
  loadMap(){
 
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

   dismiss() {
     this.viewCtrl.dismiss();
   }
}