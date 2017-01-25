import { ViewController, NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { BarcodeScanner } from 'ionic-native';
import { MedicineInfo } from '../medicineinfo/medicineinfo';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-barcodescanner',
  templateUrl: 'barcodescanner.html'
})
export class Barcodescanner {

  constructor(private navCtrl: NavController, private http: Http, private viewCtrl: ViewController) {
    BarcodeScanner.scan().then((barcodeData) => {
      let new_item: any;
      new_item = this.getItem(barcodeData.text);

    }, (err) => {
        alert(err.message);
    });
  }

  getItem(code: any) {
      let new_item: any;

      if (code && code.trim() != '') {


        this.http.get('http://medicineappbackend.me/barcode/'+ code).map(res => res.json()).subscribe(data => {
            if(data.title) {
            new_item = data;
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
            } else {
              alert("barcode not recognized!");
            }


        });

        return new_item;
      }
    }
}
