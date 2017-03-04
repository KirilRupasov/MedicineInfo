import { MyProfile } from './myprofile';
import { TestBed, async } from '@angular/core/testing';
import { AuthMock } from '../../mocks/authMock';
import { UserMockPredefined } from '../../mocks/userMockPredefined';
import { NavCtrlMock } from '../../mocks/navCtrlMock';
import { Auth, User } from '@ionic/cloud-angular';
import { NavController } from 'ionic-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Searchbar } from '../searchbar/searchbar';
import { MainMenu } from '../mainmenu/mainmenu';

let myProfile = null;

describe('MyProfile Page Tests', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MyApp, MyProfile, Searchbar, MainMenu
            ],
            
            imports: [
                IonicModule.forRoot(MyApp)
            ],
            providers: [
                {provide: Auth, useClass: AuthMock },
                {provide: NavController, useClass: NavCtrlMock },
                {provide: User, useClass: UserMockPredefined}
            ],
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should create myProfile with pre-defined data', () => {
        const test = TestBed.createComponent(MyProfile);
        myProfile = test.componentInstance;
        expect(myProfile.content).toBe("Birthdate: 07/06/1993<hr>Smoker: no<hr>Gender: male");
    });
});
