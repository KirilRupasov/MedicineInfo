import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Auth } from '@ionic/cloud-angular';
import { MainMenu } from '../pages/mainmenu/mainmenu';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { MyProfile } from '../pages/myprofile/myprofile';
import { EditProfile } from '../pages/editprofile/editprofile';
import { Logout } from '../pages/logout/logout';
import { MedicineInfo } from '../pages/medicineinfo/medicineinfo';

declare var navigator: any;
declare var Connection: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MainMenu;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public auth: Auth, public alertCtrl: AlertController) {
    this.initializeApp();

    if(this.auth.isAuthenticated()) {
        this.pages = [
              { title: 'Main Menu', component: MainMenu },
              { title: 'Log Out', component: Logout },
              { title: 'My Profile', component: MyProfile },
              { title: 'Edit Profile', component: EditProfile }
      ];
    } else {
    this.pages = [
          { title: 'Main Menu', component: MainMenu },
          { title: 'Log In', component: Login },
          { title: 'Sign Up', component: Signup }
        ];
    }

    this.checkNetwork();

    // used for an example of ngFor and navigation


  }

    checkNetwork() {
        this.platform.ready().then(() => {
            var networkState = navigator.connection.type;
            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';

            if(states[networkState] == "No network connection") {
                let alert = this.alertCtrl.create({
                    title: "Warning!",
                    subTitle: "Please turn on network connection on device, otherwise the app will not work properly!",
                    buttons: ["OK"]
                });
                alert.present();
            }
        });
    }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
