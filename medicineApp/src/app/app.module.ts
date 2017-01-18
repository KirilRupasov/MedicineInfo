import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MainMenu } from '../pages/mainmenu/mainmenu';
import { Page2 } from '../pages/page2/page2';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';

import { MedicineInfo } from '../pages/medicineinfo/medicineinfo';
import { EditProfile } from '../pages/editprofile/editprofile';
import { MyProfile } from '../pages/myprofile/myprofile';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

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
    MyProfile
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MainMenu,
    Login,
    Signup,
    MedicineInfo,
    EditProfile,
    MyProfile
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
