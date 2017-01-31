import { Component,Input, Output, AfterContentInit, ContentChild, AfterViewChecked, AfterViewInit, ViewChild, ViewChildren } from '@angular/core';
import { Barcodescanner } from '../barcodescanner/barcodescanner';
import { ModalController, ViewController, NavController, NavParams, Platform } from 'ionic-angular';
import { MedicineInfo } from '../medicineinfo/medicineinfo';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MainMenu } from '../mainmenu/mainmenu';


@Component({
  templateUrl: 'modal.html'
})

export class ModalContentPage {

  items: string[];


  constructor(private navCtrl: NavController, private http: Http, public platform: Platform, public params: NavParams, public viewCtrl: ViewController) {
    this.items = [];

  }

  setItems(new_items : any) {
    this.items = new_items;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

   searchItem(ev : any) {
      this.getItem(ev);
    }


    getItem(ev : any) {
      let new_item: any;
      let new_results: string[];

      // set val to the value of the searchbar
      let val = ev.target.value;
      if (val && val.trim() != '') {
            this.http.get('http://medicineappbackend.me/title/'+ val).map(res => res.json()).subscribe(data => {
                    if(data.title) {
                      new_item = data;
                      this.navCtrl.push(MedicineInfo, {
                           "title":  new_item.title,
                            "description": new_item.description,
                             "side_effects": new_item.side_effects
                            } ).then(() => {
                              // first we find the index of the current view controller:
                              const index = this.viewCtrl.index;
                              // then we remove it from the navigation stack
                              this.navCtrl.remove(index);
                            });
                    } else {
                      new_item = data;
                      this.navCtrl.push(MainMenu, {
                        "suggestions": new_item
                      } ).then(() => {
                        // first we find the index of the current view controller:
                        const index = this.viewCtrl.index;
                        // then we remove it from the navigation stack
                        this.navCtrl.remove(index);
                      });
                    }
                });

        return new_item;
      }
    }

    getItems(ev: any) {
      // Reset items back to all of the items
      this.items = [];

      let new_items: string[];


      // set val to the value of the searchbar
      let val = ev.target.value;
      if (val && val.trim() != '') {

      this.http.get('http://medicineappbackend.me/title/'+ val).map(res => res.json()).subscribe(data => {
              this.items = [];
              if(data.title) {
                this.items.push(data.title);
              } else {
                  for (let entry of data) {
                      this.items.push(entry.title);
                  }
              }
          });
       }
    }
}
