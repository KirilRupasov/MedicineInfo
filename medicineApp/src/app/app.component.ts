import { Component, ViewChild, Inject } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Auth, User } from '@ionic/cloud-angular';
import { MainMenu } from '../pages/mainmenu/mainmenu';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { MyProfile } from '../pages/myprofile/myprofile';
import { EditProfile } from '../pages/editprofile/editprofile';
import { Logout } from '../pages/logout/logout';
import { MedicineInfo } from '../pages/medicineinfo/medicineinfo';
import { PagesService } from './pages.service';
import { iMyApp } from './app.interface';

declare var navigator: any;
declare var Connection: any;

@Component({
  templateUrl: 'app.html',
  providers: [PagesService]
})

export class MyApp implements iMyApp {
  @ViewChild(Nav) nav: Nav;

  username: string;

  rootPage: any = MainMenu;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public auth: Auth, public alertCtrl: AlertController, public user: User, private pagesService: PagesService) {

    this.initializeApp();
    this.pagesService.register(this);
    this.checkNetwork();

    // used for an example of ngFor and navigation


  }

  showLoggedMenu() {
    this.username = " (" + this.user.details.email + ")";
        this.pages = [
              { title: 'Main Menu', component: MainMenu },
              { title: 'Log Out', component: Logout },
              { title: 'My Profile', component: MyProfile },
              { title: 'Edit Profile', component: EditProfile }
      ];
  }

  showNonLoggedMenu() {
    this.username = "";
    this.pages = [
          { title: 'Main Menu', component: MainMenu },
          { title: 'Log In', component: Login },
          { title: 'Sign Up', component: Signup }
        ];    
  }

  setUsername(username: string) {
    this.username = username;
  }

  setPages(pages: any[]) {
    this.pages = pages;
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

      // Confirm exit if user decides to quit the app
        this.platform.registerBackButtonAction(() => {
            if (this.nav.length() == 1) {
              this.confirmExit();
            }

            this.nav.pop();
        });
    });
  }

  confirmExit() {
     let alert = this.alertCtrl.create({
        title: "Quit",
        message: "Are you sure you want to exit the app?",
        buttons: [
            {
                text: 'No',
                handler: () => {
                    alert.dismiss();
                }
            },
            {
                text: 'Yes',
                handler: () => {
                    this.platform.exitApp();
                }
            }
        ]
    });
    alert.present();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {"app_component" : this});
  }
}
