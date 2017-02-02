import { Barcodescanner } from './barcodescanner'
import { Http } from '@angular/http';
import { ModalController, ViewController, NavController, NavParams, Platform } from 'ionic-angular';

let barcodeScanner = null;

describe('Barcode Scanner Service', () => {

    beforeEach(() => {
      barcodeScanner = new Barcodescanner(new NavController(), new Http(), new ViewController());
    });

   it('should call alert when no barcode provided', () => {
      spyOn(window, 'alert');
      barcodeScanner.getItem("");
      expect(window.alert).toHaveBeenCalledWith('No barcode provided!');
   });
});
