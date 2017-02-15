import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
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
 
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public params: NavParams, public http: Http) {
    this.medicine_title = this.params.get('medicine_title');
    this.stores = this.params.get('stores');
  }
 
  ngAfterViewInit() {
    this.loadMap();
  }
 
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

  loadStores(position) {
      let storeArr: string[];
      if(this.stores && this.stores != "") {
        storeArr = this.stores.split(",");
              alert(storeArr[0]);
              for(let i=0; i<storeArr.length; i++) {
                alert(storeArr[i]);
                this.http.get(
                          'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyD1WoIDgKeQvWoCTC0xGebny7BGYyNnRo4&location='+ position.coords.latitude + ',' + position.coords.longitude +'&radius=3000&keyword=' + storeArr[i].replace(" ", "+")
                          ).map(res => res.json()).subscribe(
                            data => {
                              this.displayStores(data.results);
                            },
                            err => {
                                console.log(err);
                            }
                  );
        } 
      } else {
          alert("Sorry, no stores found!");
      }
  }



  displayStores(stores: any[]) {
    for(let entry of stores) {
      let latLng = new google.maps.LatLng(entry.geometry.location.lat, entry.geometry.location.lng);
      var image = {
        url: "marker.gif",
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(30, 30),
      };

      let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: latLng,
          icon: "images/marker.gif"
      });  
    }
  }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}