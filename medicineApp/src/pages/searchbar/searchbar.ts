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
import { Suggestions } from '../suggestions/suggestions';

@Component({
  selector: 'search-bar',
  templateUrl: 'searchbar.html'
})

export class Searchbar {

  /**
   * @name constructor
   * @param {ModalController} modalCtrl Modal Controller
   * @param {NavController} navCtrl Navigation Controller
   * @param {Http} http HTTP request handler
   * 
   * @description
   * 
   * Empty constructor
   */
  constructor(public modalCtrl: ModalController, public navCtrl: NavController, private http: Http) {
  }

  /**
   * @name goToItem
   * @param {object} item medicine which has title, description, benefits, and other general information
   * 
   * @description
   * 
   * This method takes medicine as argument and goes to MedicineInfo object
   * with medicine being displayed.
   * Error message is displayed if incorrect data is provided
   */
  goToItem(item: any) {
    if(item.title && item.description && item.side_effects && item.how_does_it && item.benefits) {
      this.navCtrl.push(MedicineInfo, {
        "title":  item.title,
        "description": item.description,
        "side_effects": item.side_effects,
        "how_does_it": item.how_does_it,
        "benefits": item.benefits,
        "elderly": item.elderly,
        "stores": item.stores
      });
    }
  }

  /**
   * @name setSuggestions
   * @param {any[]} data objects containing drug references
   * 
   * @description
   * 
   * Updates collection of drug references.
   */
  setSuggestions(data: any[]) {
    this.navCtrl.push(Suggestions, {
        "data":  data,
      });
  }

  /**
   * @name fetchItems
   * @param {string} title title of medicine
   * 
   * @description
   * 
   * This method fetches medicines from backend by keyword as JSON data
   */
  fetchItems(title: string) {
    return this.http.get('http://medicineappbackend.me/title/'+ title).map(res => res.json());
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
}


