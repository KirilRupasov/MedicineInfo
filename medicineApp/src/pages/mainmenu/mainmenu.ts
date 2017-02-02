import { Component, ElementRef } from '@angular/core';
import { Barcodescanner } from '../barcodescanner/barcodescanner';
import { ModalController, ViewController, NavController, NavParams, Platform } from 'ionic-angular';
import { MedicineInfo } from '../medicineinfo/medicineinfo';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MyProfile } from '../myprofile/myprofile';
import { ModalContentPage } from '../modal/modalcontentpage';

@Component({
  selector: 'page-mainmenu',
  templateUrl: 'mainmenu.html'
})


export class MainMenu {
  suggestions: string[];
  intro_sugg: string;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, private http: Http, public viewCtrl: ViewController) {
    this.suggestions = [];
  }

  getSuggestions() {
    return this.suggestions;
  }

  setSuggestions(suggestions: any[]) {
    let new_suggestions_formatted: any[];
    if(suggestions[0]) {
      this.intro_sugg = "Where you looking for...";
      new_suggestions_formatted = [];
      for(let entry of suggestions) {
        if(entry.title && entry.description && entry.side_effects) {
          entry.description_short = entry.description.substr(0, 40) + "...";
          entry.description_short = entry.description_short.replace('<p>', '');
          entry.description_short = entry.description_short.replace('</p>', '');
          entry.description_short = entry.description_short.replace('is', '-');
          new_suggestions_formatted.push(entry);
        }
      }
      this.suggestions = new_suggestions_formatted;
    }
  }


  goToItem(item: any) {
    if((item.title && item.description) && item.side_effects) {
      this.navCtrl.push(MedicineInfo, {
        "title":  item.title,
        "description": item.description,
        "side_effects": item.side_effects
      }).then(() => {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
      });
    } else {
      alert("Error! Product not provided!");
    }
  }

  fetchItems(val: any) {
    return this.http.get('http://medicineappbackend.me/title/'+ val).map(res => res.json());
  }

  openModal() {
    let modal = this.modalCtrl.create(ModalContentPage, {"root" : this});
    modal.present();
  }

  barcodescan(ev: any) {
    this.navCtrl.push(Barcodescanner);
  }

}


