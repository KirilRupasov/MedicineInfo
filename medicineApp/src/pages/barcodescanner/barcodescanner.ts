import { NavController } from 'ionic-angular';
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

  constructor(private navCtrl: NavController, private http: Http) {
    BarcodeScanner.scan().then((barcodeData) => {
      let new_item: any;
      alert(barcodeData.text);
      new_item = this.getItem(barcodeData.text);
      this.navCtrl.push(MedicineInfo, {
           "title":  new_item.title,
            "description": new_item.description,
             "side_effects": new_item.side_effects
            } );
    }, (err) => {
        alert(err.message);
    });
  }

  getItem(code: any) {
      let new_item: any;

      if (code && code.trim() != '') {
      /*$.ajax({
          url: 'http://medicineappbackend.me/title/'+ code,
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
        });*/

        this.http.get('http://medicineappbackend.me/barcode/'+ code).map(res => res.json()).subscribe(data => {
                          new_item = data[0];
                          return new_item;
                      });

        return new_item;
      }
    }
}
