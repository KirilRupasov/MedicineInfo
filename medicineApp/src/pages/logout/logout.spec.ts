import { Logout } from './logout';
import { TestBed, async } from '@angular/core/testing';
import { AuthMock } from '../../mocks/authMock';
import { NavCtrlMock } from '../../mocks/navCtrlMock';
import { Auth } from '@ionic/cloud-angular';
import { NavController, AlertController } from 'ionic-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Searchbar } from '../searchbar/searchbar';
import { MainMenu } from '../mainmenu/mainmenu';

let logout = null;

describe('Login Page Tests', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MyApp, Logout, Searchbar, MainMenu
            ],
            
            imports: [
                IonicModule.forRoot(MyApp)
            ],
            providers: [
                {provide: Auth, useClass: AuthMock },
                {provide: NavController, useClass: NavCtrlMock },
            ],
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should NOT login because no login provided', () => {
        const test = TestBed.createComponent(Logout);
        logout = test.componentInstance;
        expect(logout.getAuth().isAuthenticated()).toBe(false);
    });
});
