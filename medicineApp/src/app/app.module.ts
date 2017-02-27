import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MainMenu } from '../pages/mainmenu/mainmenu';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { MedicineInfo } from '../pages/medicineinfo/medicineinfo';
import { EditProfile } from '../pages/editprofile/editprofile';
import { MyProfile } from '../pages/myprofile/myprofile';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { SearchModal } from '../pages/searchModal/searchModal';
import { ReviewModal } from '../pages/reviewModal/reviewModal';
import { Logout } from '../pages/logout/logout';
import { HttpModule } from '@angular/http';
import { MagicBall } from '../providers/magic-ball';
import { ReadReviewsModal } from '../pages/readReviewsModal/readReviewsModal';
import { StoreLocator } from '../pages/storelocator/storelocator';
import { PagesService } from './pages.service';
import { Searchbar } from '../pages/searchbar/searchbar';
import { Suggestions } from '../pages/suggestions/suggestions';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'c9dcf35e'
  }
};

@NgModule({
  declarations: [
    MyApp,
    MainMenu,
    Login,
    Signup,
    MedicineInfo,
    EditProfile,
    MyProfile,
    SearchModal,
    ReviewModal,
    ReadReviewsModal,
    StoreLocator,
    Logout,
    Searchbar,
    Suggestions
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MainMenu,
    Login,
    Signup,
    MedicineInfo,
    EditProfile,
    MyProfile,
    SearchModal,
    ReviewModal,
    ReadReviewsModal,
    StoreLocator,
    Logout,
    Suggestions
  ],
  providers: [PagesService, {provide: ErrorHandler, useClass: IonicErrorHandler}, MagicBall]
})
export class AppModule {}
