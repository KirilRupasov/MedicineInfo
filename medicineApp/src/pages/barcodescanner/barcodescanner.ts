import { ViewController, NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { BarcodeScanner } from 'ionic-native';
import { MedicineInfo } from '../medicineinfo/medicineinfo';
import { Http } from '@angular/http';
import { MainMenu } from '../mainmenu/mainmenu';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-barcodescanner',
  templateUrl: 'barcodescanner.html'
})
export class Barcodescanner {

  constructor(private navCtrl: NavController, private http: Http, private viewCtrl: ViewController) {
    BarcodeScanner.scan().then((barcodeData) => {
      this.getItem(barcodeData.text);
    }, (err) => {
        alert(err.message);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getItem(code: any) {

      if (code && code.trim() != '') {
        this.http.get('http://medicineappbackend.me/barcode/'+ code).map(res => res.json()).subscribe(data => {
            if(data == "" || data == null) {
              alert("Barcode not recognized!");
              this.dismiss();
              /*this.navCtrl.push(MainMenu).then(() => {
                const index = this.viewCtrl.index;
                this.navCtrl.remove(index);
              });*/
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
              this.dismiss();
              /*this.navCtrl.push(MainMenu).then(() => {
                const index = this.viewCtrl.index;
                this.navCtrl.remove(index);
              });*/
            }


        });
      } else {
        alert("No barcode provided!");
        this.dismiss();
        //location.reload();
      }
    }
}
