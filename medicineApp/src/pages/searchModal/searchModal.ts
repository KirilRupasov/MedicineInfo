/**
 * @name SearchModal
 * 
 * @description
 * 
 * Search Modal
 */

import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Searchbar } from 'ionic-angular';

@Component({
  templateUrl: 'searchModal.html',
})

export class SearchModal {

  items: string[];

  @ViewChild('searchbar') searchbar: Searchbar;

  /**
   * @name constructor
   * @param {NavParams} params Navigation Paramets, which contains the Searchbar Component
   * @param {ViewController} viewCtrl View Controller
   */
  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.items = []; 
  }

  /**
   * @name ngAfterViewInit
   * 
   * @description
   * 
   * sets focus on input element once the page is initialized
   */
  ngAfterViewInit() {
    this.searchbar.setFocus();
  }

  /**
   * @name dismiss
   * 
   * @description
   * 
   * This function closes modal
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * @name searchItem
   * @param {any} ev event hat launched the function
   * 
   * @description
   * 
   * This function gets the value entered by user, connects with back-end,
   * and if there is more than one result -> provide user with 10 suggestions,
   * otherwise -> display that one drug reference.
   * 
   */
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

  /**
   * @name goToItem
   * @param {any} item drug reference
   * 
   * @description
   * 
   * This function displays provided drug reference and closes Modal.
   */
  goToItem(item: any) {
    this.params.get('root').goToItem(item);
    this.viewCtrl.dismiss();
  }


  /**
   * @name getItems
   * @param {any} ev event that launched this function
   * 
   * @description
   * 
   * This function loads items as user types symbols and displays
   * suggestions.
   */
  getItems(ev: any) {
    let val = ev.target.value;
    this.items = [];
    this.params.get('root').fetchItems(val).subscribe(
     data => {
       if(data != null && data.title) {
         this.items.push(data);
       } else if(data != null) {
         for (let data_item of data) {
            this.items.push(data_item);
         }
       }
     },
     err => {
         console.log(err);
     }
   );
  }
}
