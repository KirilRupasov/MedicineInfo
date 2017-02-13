import { Component } from '@angular/core';
import { Barcodescanner } from '../barcodescanner/barcodescanner';
import { ModalController, ViewController, NavController } from 'ionic-angular';
import { MedicineInfo } from '../medicineinfo/medicineinfo';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ModalContentPage } from '../searchModal/modalcontentpage';
import { BarcodeScanner } from 'ionic-native';


@Component({
  selector: 'page-mainmenu',
  templateUrl: 'mainmenu.html'
})

/**
 * This class represents the Main Menu page
 * in the app.
 */
export class MainMenu {
  suggestions: string[];
  intro_sugg: string;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, private http: Http, public viewCtrl: ViewController) {
    this.suggestions = [];
  }

  /**
   * @returns this.suggestions list of medicine names that matches search
   */
  getSuggestions() {
    return this.suggestions;
  }

  /**
   * This method gets 10 suggestions that matched search criteria and 
   * stores them in array which is displayed in Main Menu
   * @param suggestions list of medicine names that matches search
   */
  setSuggestions(suggestions: any[]) {
    let new_suggestions_formatted: any[];
    if(suggestions[0]) {
      this.intro_sugg = "Where you looking for...";
      new_suggestions_formatted = [];
      let i = 0;
      for(let entry of suggestions) {
        if(entry.title && entry.description && entry.side_effects && entry.how_does_it && entry.benefits && i < 10) {
          //format the description of Medicine
          entry.description_short = entry.description.substr(0, 40) + "...";
          entry.description_short = entry.description_short.replace('<p>', '');
          entry.description_short = entry.description_short.replace('</p>', '');
          entry.description_short = entry.description_short.replace('is', '-');
          new_suggestions_formatted.push(entry);
        }
        //restrict number of suggestions to 10
        i++;
      }
      this.suggestions = new_suggestions_formatted;
    }
  }

  /**
   * This method takes medicine as argument and goes to MedicineInfo object
   * with medicine being displayed.
   * Error message is displayed if incorrect data is provided
   * @param item medicine which has title, description, benefits, and other general information
   */
  goToItem(item: any) {
    if(item.title && item.description && item.side_effects && item.how_does_it && item.benefits) {
      this.navCtrl.push(MedicineInfo, {
        "title":  item.title,
        "description": item.description,
        "side_effects": item.side_effects,
        "how_does_it": item.how_does_it,
        "benefits": item.benefits,
        "elderly": item.elderly
      }).then(() => {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
      });
    } else {
      alert("Error! Product not provided!");
    }
  }

  /**
   * This method fetches medicines from backend by keyword as JSON data
   * @param title of drug
   */
  fetchItems(title: string) {
    return this.http.get('http://medicineappbackend.me/title/'+ title).map(res => res.json());
  }

  /**
   * This method opens Modal for Medicine keyword search
   */
  openModal() {
    let modal = this.modalCtrl.create(ModalContentPage, {"root" : this});
    modal.present();
  }

  /**
   * This method opens Barcodescanner page
   */
  barcodescan(ev: any) {
    BarcodeScanner.scan().then((barcodeData) => {
      this.getItem(barcodeData.text);
    }, (err) => {
        alert(err.message);
    });
  }

  getItem(code: any) {

      if (code && code.trim() != '') {
        this.http.get('http://medicineappbackend.me/barcode/'+ code).map(res => res.json()).subscribe(data => {
            if(data == "" || data == null) {
              alert("Barcode not recognized!");
            } else if(data.title) {
                        this.navCtrl.push(MedicineInfo, {
                                   "title":  data.title,
                                    "description": data.description,
                                     "side_effects": data.side_effects
                                    } ).then(() => {
                                               const index = this.viewCtrl.index;
                                               this.navCtrl.remove(index);
                                             });
            } else {
              alert("Barcode not recognized!");
            }


        });
      } else {
        alert("No barcode provided!");
      }
    }

}


