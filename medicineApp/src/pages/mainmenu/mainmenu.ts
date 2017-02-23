/**
 * @name MainMenu
 * 
 * @description
 * 
 * The Main Menu page
 */

import { Component,Inject } from '@angular/core';
import { ModalController, ViewController, NavController, NavParams } from 'ionic-angular';
import { MedicineInfo } from '../medicineinfo/medicineinfo';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ModalContentPage } from '../searchModal/modalcontentpage';
import { BarcodeScanner } from 'ionic-native';
import { MyProfile } from '../myprofile/myprofile';
import { EditProfile } from '../editprofile/editprofile';
import { Logout } from '../logout/logout';
import { Auth, User } from '@ionic/cloud-angular';
import { Login } from '../login/login';
import { Signup } from '../signup/signup';
import { PagesService } from '../../app/pages.service';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-mainmenu',
  templateUrl: 'mainmenu.html',
  providers: [{ provide: 'PagesService', useClass: PagesService }]
})

export class MainMenu {
  suggestions: string[];
  intro_sugg: string;

  /**
   * @name constructor
   * @param {PagesService} pagesService Service which holds navigation pages
   * @param {ModalController} modalCtrl Modal Controller
   * @param {NavController} navCtrl Navigation Controller
   * @param {Http} http Controller for HTTP requests
   * @param {AlertController} alertCtrl Alert Controller
   * @param {Auth} auth Authentication Controller
   * 
   */
  constructor(
    private pagesService: PagesService, private modalCtrl: ModalController,
    private navCtrl: NavController, private http: Http,
    private alertCtrl: AlertController, private auth: Auth
  ) {
    this.suggestions = [];
  }

  /**
   * @name ngAfterViewInit
   * 
   * @description
   * 
   * checks if user is authenticated and sets navigation pages appropriately.
   */
  ngAfterViewInit() {
    if(this.auth.isAuthenticated()) {
      this.pagesService.logged();
    } else {
      this.pagesService.nonLogged();
    }
  }


  /**
   * @name getSuggestions
   * @returns this.suggestions list of medicine names that matches search
   */
  getSuggestions() {
    return this.suggestions;
  }

  /**
   * @name setSuggestions
   * @param {any[]} suggestions list of medicine names that matches search
   * 
   * @description
   * 
   * This method gets 10 suggestions that matched search criteria and 
   * stores them in array which is displayed in Main Menu
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
   * @name openModal
   * 
   * @description
   * 
   * This method opens Modal for Medicine keyword search
   */
  openModal() {
    let modal = this.modalCtrl.create(ModalContentPage, {"root" : this});
    modal.present();
  }

  /**
   * @name barcodescan
   * @param {event} ev
   * @description
   * 
   * This method launches BarcodeScanner plugin and scans barcode
   */
  barcodescan(ev: any) {
    BarcodeScanner.scan().then((barcodeData) => {
      this.getItemByBarcode(barcodeData.text);
    }, (err) => {
        alert(err.message);
    });
  }

  /**
   * @name getItemByBarcode
   * @param {string} barcode string with barcode
   * 
   * @description
   * 
   * This method uses barocde provided in order to
   * find the medicine from back-end by barcode.
   * If medicine is found -> MedicineInfo page is loaded with information
   * Otherwise -> alert the user
   */
  getItemByBarcode(barcode: string) {
      if (barcode && barcode.trim() != '') {
        this.http.get('http://medicineappbackend.me/barcode/'+ barcode).map(res => res.json()).subscribe(data => {
            if(data == "" || data == null) {
              let alert = this.alertCtrl.create({
                  title: 'Error(s)!',
                  subTitle: "Barcode not recognized!",
                  buttons: ['OK']
                });
              alert.present();
            } else if(data.title && data.description && data.how_does_it && data.benefits) {     
                        this.navCtrl.push(MedicineInfo, {
                                   "title":  data.title,
                                    "description": data.description,
                                     "side_effects": data.side_effects,
                                     "how_does_it": data.how_does_it,
                                    "benefits": data.benefits,
                                    "elderly": data.elderly,
                                    "stores": data.stores
                                    } );
            } else {
              let alert = this.alertCtrl.create({
                  title: 'Error(s)!',
                  subTitle: "Barcode not recognized!",
                  buttons: ['OK']
                });
              alert.present();
            }
        });
      }
    }
}


