import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-mainmenu',
  templateUrl: 'mainmenu.html'
})


export class MainMenu {


  searchQuery: string = '';
    items: string[];

    constructor() {
      this.initializeItems();
    }

  initializeItems() {
    this.items = [];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    //fetch results from the db
    const messages = this.db.collection('messages');

    messages.fetch().subscribe(
        result => console.log('Result:', result),
        err => console.error(err),
        () => console.log('Results fetched')
    );

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
