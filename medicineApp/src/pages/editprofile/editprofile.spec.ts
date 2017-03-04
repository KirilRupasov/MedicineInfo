import { EditProfile } from './editprofile';
import { TestBed, async } from '@angular/core/testing';
import { AuthMock } from '../../mocks/authMock';
import { NavCtrlMock } from '../../mocks/navCtrlMock';
import { UserMock } from '../../mocks/userMock';
import { Auth, User } from '@ionic/cloud-angular';
import { NavController } from 'ionic-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Searchbar } from '../searchbar/searchbar';
import { MyProfile } from '../myprofile/myprofile';

let editProfile = null;

describe('Edit Profile Page Tests', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MyApp,  EditProfile, Searchbar, MyProfile
            ],
            
            imports: [
                IonicModule.forRoot(MyApp)
            ],
            providers: [
                {provide: Auth, useClass: AuthMock },
                {provide: User, useClass: UserMock },
                {provide: NavController, useClass: NavCtrlMock },
            ],
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should update user profile', () => {
        const test = TestBed.createComponent(EditProfile);
        editProfile = test.componentInstance;
        editProfile.date_of_birth = "07/06/1993";
        editProfile.smoker_value = "no";
        editProfile.gender_value = "male";

        editProfile.save();

        expect(editProfile.getUser().get("date_of_birth", undefined)).toBe("07/06/1993");
        expect(editProfile.getUser().get("smoker", undefined)).toBe("no");
        expect(editProfile.getUser().get("gender", undefined)).toBe("male");
    });

    it('should update user profile apart from date_of_birth', () => {
        const test = TestBed.createComponent(EditProfile);
        editProfile = test.componentInstance;
        editProfile.smoker_value = "no";
        editProfile.gender_value = "male";

        editProfile.save();

        expect(editProfile.getUser().get("date_of_birth", undefined)).toBe(undefined);
        expect(editProfile.getUser().get("smoker", undefined)).toBe("no");
        expect(editProfile.getUser().get("gender", undefined)).toBe("male");
    });


    it('should update user profile apart from smoker status', () => {
        const test = TestBed.createComponent(EditProfile);
        editProfile = test.componentInstance;
        editProfile.date_of_birth = "07/06/1993";
        editProfile.gender_value = "male";

        editProfile.save();

        expect(editProfile.getUser().get("date_of_birth", undefined)).toBe("07/06/1993");
        expect(editProfile.getUser().get("smoker", undefined)).toBe(undefined);
        expect(editProfile.getUser().get("gender", undefined)).toBe("male");
    });

    it('should update user profile apart from gender value', () => {
        const test = TestBed.createComponent(EditProfile);
        editProfile = test.componentInstance;
        editProfile.date_of_birth = "07/06/1993";
        editProfile.smoker_value = "no";

        editProfile.save();

        expect(editProfile.getUser().get("date_of_birth", undefined)).toBe("07/06/1993");
        expect(editProfile.getUser().get("smoker", undefined)).toBe("no");
        expect(editProfile.getUser().get("gender", undefined)).toBe(undefined);
    });
});
