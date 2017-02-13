import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ViewController, NavController, NavParams, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Searchbar } from 'ionic-angular';



@Component({
  templateUrl: 'modal.html',
})

export class ModalContentPage {

  items: string[];

  @ViewChild('searchbar') searchbar:Searchbar;

  constructor(private navCtrl: NavController, private http: Http, public platform: Platform, public params: NavParams, public viewCtrl: ViewController) {
    this.items = [];
  }

  ngAfterViewInit() {
    this.searchbar.setFocus();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  searchItem(ev: any) {
    let val = ev.target.value;

    this.params.get('root').fetchItems(val).subscribe(
      data => {
        if(data != null && data.title) {
          this.params.get('root').goToItem(data);
        } else if(data != null) {
          this.params.get('root').setSuggestions(data);
        }
      },
      err => {
          console.log(err);
      }
    );

    this.viewCtrl.dismiss();
  }

  getItems(ev: any) {
    let val = ev.target.value;
    this.items = [];

    this.params.get('root').fetchItems(val).subscribe(
     data => {
       if(data != null && data.title) {
         this.items.push(data.title);
       } else if(data != null) {
         for (let data_item of data) {
            this.items.push(data_item.title);
         }
       }
     },
     err => {
         console.log(err);
     }
   );
  }
}
