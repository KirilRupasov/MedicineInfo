import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';


import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
  email_value: any;
  password_value: any;

  constructor(public auth: Auth, public user: User) {

  }

  public login(ev: any) {
    let details: UserDetails = {'email': this.email_value, 'password': this.password_value};

    this.auth.login('basic', details).then(() => {
      alert("success");
    }, () => {
      alert("fail");
    });
  }

}
