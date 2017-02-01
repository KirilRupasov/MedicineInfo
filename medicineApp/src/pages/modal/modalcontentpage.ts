import { Component, Input, Output, AfterContentInit, ContentChild, AfterViewChecked, AfterViewInit, ViewChild, ViewChildren, ElementRef, Directive, Renderer } from '@angular/core';
import { Barcodescanner } from '../barcodescanner/barcodescanner';
import { App, ModalController, ViewController, NavController, NavParams, Platform } from 'ionic-angular';
import { MedicineInfo } from '../medicineinfo/medicineinfo';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MainMenu } from '../mainmenu/mainmenu';
import { Searchbar } from 'ionic-angular';
import { MyProfile } from '../myprofile/myprofile';



@Component({
  templateUrl: 'modal.html',

})

export class ModalContentPage {

  items: string[];

  @ViewChild('searchbar') searchbar:Searchbar;


  constructor(private navCtrl: NavController, private http: Http, public platform: Platform, public params: NavParams, public viewCtrl: ViewController, private _el: ElementRef, private renderer: Renderer, public appCtrl: App) {
    this.items = [];
  }

  ngAfterViewInit() {
    this.searchbar.setFocus();
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


      // set val to the value of the searchbar
      let val = ev.target.value;
      if (val && val.trim() != '') {
        this.params.get('root').search(val);
        this.viewCtrl.dismiss();
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
