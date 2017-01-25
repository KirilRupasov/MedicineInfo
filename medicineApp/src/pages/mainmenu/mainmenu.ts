import { Component } from '@angular/core';
import { Barcodescanner } from '../barcodescanner/barcodescanner';
import { ViewController, NavController } from 'ionic-angular';
import { MedicineInfo } from '../medicineinfo/medicineinfo';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-mainmenu',
  templateUrl: 'mainmenu.html'
})


export class MainMenu {


  searchQuery: string = '';
  items: string[];

  constructor(private navCtrl: NavController, private http: Http, private viewCtrl: ViewController) {
    this.initializeItems();
  }

  initializeItems() {
    this.items = [];
  }

  setItems(new_items : any) {
    this.items = new_items;
  }

  barcodescan(ev: any) {
    this.navCtrl.push(Barcodescanner);
  }

  searchItem(ev : any) {
    let new_item : any;
    new_item = this.getItem(ev);

  }


  getItem(ev : any) {
    let new_item: any;

    // set val to the value of the searchbar
    let val = ev.target.value;
    if (val && val.trim() != '') {
          this.http.get('http://medicineappbackend.me/title/'+ val).map(res => res.json()).subscribe(data => {
                  new_item = data[0];
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
              });

      return new_item;
    }
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    let new_items: string[];


    // set val to the value of the searchbar
    let val = ev.target.value;
    if (val && val.trim() != '') {
    /*$.ajax({
        //url: 'http://medicineappbackend.me/title/'+ val,
        url: '/api/' + val,
        type: 'get',
        //dataType: 'json',
        success: function (return_data)
        {
          alert(return_data);

          this.items = [];

          for (let entry of return_data) {
              this.items.push(entry.title);
          }
          return new_items = this.items;
        },
        error: function (xhr, status, error)
        {
            var err = eval("(" + xhr.responseText + ")");
            console.log(err.Message);
            return err.Message;
        },
        async: false
      });

      this.items = new_items;
    }*/

    this.http.get('http://medicineappbackend.me/title/'+ val).map(res => res.json()).subscribe(data => {
            this.items = [];
                      for (let entry of data) {
                          this.items.push(entry.title);
                      }
                      return new_items = this.items;
        });

     }



  }

}
