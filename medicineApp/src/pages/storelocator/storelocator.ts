/**
 * @name StoreLocator
 * 
 * @description
 * 
 * Store Locator modal
 */

import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Geolocation } from 'ionic-native';
 
declare var google;

@Component({
  templateUrl: 'storelocator.html'
})

export class StoreLocator {
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  medicine_title: string;
  stores: string;
  infowindow: any;
 
  /**
   * @name constructor
   * @param {ViewController} viewCtrl View Controller
   * @param {NavParams} navParams Navigation Parameters, used to get medicine title and available stores list
   */
  constructor(private viewCtrl: ViewController, private params: NavParams, private http: Http, private alertCtrl: AlertController) {
    this.medicine_title = this.params.get('medicine_title');
    this.stores = this.params.get('stores');
  }
 
 /**
  * @name ngAfterViewInit
  *
  * @description
  *
  * initializes GoogleMaps after Page is loaded
  */
  ngAfterViewInit() {
    this.loadMap();
  }
 
  /**
   * @name loadMap
   *  
   * @description
   * 
   * This function intializes Google Maps using user's coordinates and loads nearby stores. 
   */ 
  loadMap() {
    Geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.loadStores(position);
 
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * @name loadStores
   * @param {any} position user's coordinates
   * 
   * @description
   * 
   * Loads list of stores that sell this drug from back-end and displays nearest ones on Map.
   */
  loadStores(position: any) {
      let storeArr: string[];
      if(this.stores && this.stores != "") {
        storeArr = this.stores.split(",");
              for(let i=0; i<storeArr.length; i++) {
                let storeName = storeArr[i];
                this.http.get(
                          'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyD1WoIDgKeQvWoCTC0xGebny7BGYyNnRo4&location='+ position.coords.latitude + ',' + position.coords.longitude +'&radius=3000&keyword=' + storeName.replace(" ", "+")
                          ).map(res => res.json()).subscribe(
                            data => {
                              this.displayStores(data.results, storeName);
                            },
                            err => {
                                console.log(err);
                            }
                  );
        } 
      } else {
        let alert = this.alertCtrl.create({
            title: 'Sorry!',
            subTitle: "No stores found.",
            buttons: ['OK']
          });
        alert.present();
      }
  }


  /**
   * @name displayStores
   * @param {any[]} stores array of objects representing stores
   * 
   * @description
   * 
   * This function loops through list of objects representing store coordinates and puts them on Map.
   */
  displayStores(stores: any[], keywords: string) {
    for(let entry of stores) {
      //alert(entry.name);
      if(entry.name.toLowerCase() == keywords.toLowerCase()) {
        let latLng = new google.maps.LatLng(entry.geometry.location.lat, entry.geometry.location.lng);

        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            icon: "images/marker.gif"
        });

        let content = "<h4 style='color: black !important;'>" + entry.name + "</h4>Address: " + entry.vicinity;          
  
        this.addInfoWindow(marker, content);
        }  
    }
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
  
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
  });
 
}

  /**
   * @name dismiss
   * 
   * @description
   * 
   * Closes modal
   */
  dismiss() {
      this.viewCtrl.dismiss();
  }
}