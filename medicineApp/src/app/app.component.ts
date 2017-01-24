import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { MainMenu } from '../pages/mainmenu/mainmenu';
import { Page2 } from '../pages/page2/page2';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { MedicineInfo } from '../pages/medicineinfo/medicineinfo';
import { MyProfile } from '../pages/myprofile/myprofile';
import { EditProfile } from '../pages/editprofile/editprofile';
import { Barcodescanner } from '../pages/barcodescanner/barcodescanner';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MainMenu;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public auth: Auth) {
    this.initializeApp();

    if(this.auth.isAuthenticated()) {
        this.pages = [
              { title: 'Main Menu', component: MainMenu },
              { title: 'Log Out', component: Login },
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

    // used for an example of ngFor and navigation


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
