import { Component, ElementRef } from '@angular/core';
import { Barcodescanner } from '../barcodescanner/barcodescanner';
import { ModalController, ViewController, NavController, NavParams, Platform } from 'ionic-angular';
import { MedicineInfo } from '../medicineinfo/medicineinfo';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ModalContentPage } from '../modal/modalcontentpage';

@Component({
  selector: 'page-mainmenu',
  templateUrl: 'mainmenu.html'
})


export class MainMenu {
  suggestions: string[];
  intro_sugg: string;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams,
  private http: Http, public viewCtrl: ViewController, public elementRef: ElementRef) {
    let new_suggestions = navParams.get("suggestions");
    let new_suggestions_formatted: string[];

    if(new_suggestions == null) {
      this.suggestions = [];
      this.intro_sugg = "";
    } else {
      this.intro_sugg = "Where you looking for...";
      new_suggestions_formatted = [];
      for(let entry of new_suggestions) {
        entry.description = entry.description.substr(0, 45) + "...";
        entry.description = entry.description.replace('<p>', '');
        entry.description = entry.description.replace('</p>', '');
        entry.description = entry.title + ' - ' + entry.description;

        new_suggestions_formatted.push(entry);
      }
      this.suggestions = new_suggestions_formatted;
    }
  }

      getItem(val: any) {
        let new_item: any;

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
                      }
                  });
        }

      }

  openModal() {
    let modal = this.modalCtrl.create(ModalContentPage);
    modal.present();
  }

  barcodescan(ev: any) {
    this.navCtrl.push(Barcodescanner);
  }

}


