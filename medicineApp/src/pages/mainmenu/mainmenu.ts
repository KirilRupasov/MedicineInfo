import { Component } from '@angular/core';
import { Barcodescanner } from '../barcodescanner/barcodescanner';
import { NavController } from 'ionic-angular';
import { MedicineInfo } from '../medicineinfo/medicineinfo';
import * as $ from 'jquery';

@Component({
  selector: 'page-mainmenu',
  templateUrl: 'mainmenu.html'
})


export class MainMenu {


  searchQuery: string = '';
  items: string[];

  constructor(private navCtrl: NavController) {
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
    this.navCtrl.push(MedicineInfo, {
     "title":  new_item.title,
      "description": new_item.description,
       "side_effects": new_item.side_effects
      } );
  }


  getItem(ev : any) {
    let new_item: any;

    // set val to the value of the searchbar
    let val = ev.target.value;
    if (val && val.trim() != '') {
    $.ajax({
        url: 'http://localhost/public_html/medicineInfoBackEnd/public/title/'+ val,
        //url: '/api',
        type: 'get',
        dataType: 'json',
        success: function (return_data)
        {
          new_item = return_data[0];
          return new_item;
        },
        error: function (xhr, status, error)
        {
            var err = eval("(" + xhr.responseText + ")");
            console.log(err.Message);
            return err.Message;
        },
        async: false
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
    $.ajax({
        url: 'http://localhost/public_html/medicineInfoBackEnd/public/title/'+ val,
        //url: '/api',
        type: 'get',
        dataType: 'json',
        success: function (return_data)
        {
        // if the value is an empty string don't filter the items
          /*this.items = this.items.filter((item) => {
            return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })*/

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
    }



  }

}
