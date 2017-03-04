import { UserDetails, IDetailedError } from '@ionic/cloud-angular';

export class AuthMock {
    authenticated: boolean;
    mockUser: any;

    constructor() {
        this.authenticated = true;
        this.mockUser = {
            "email": "abc@abc.com",
            "password" : "123123"
        }
    }

    isAuthenticated() {
        return this.authenticated;
    }

    logout() {
        this.authenticated = false;
    }

    login(mode: string, userDetails: UserDetails) {
        return new Promise<AuthMock>((resolve, reject) => {
            if(userDetails.email == this.mockUser.email && userDetails.password == this.mockUser.password) {
                this.authenticated = true;
                resolve();
            } else {
                this.authenticated = false;
                reject('Incorrect email/password combination!');
            }
        });     
    }

    signup(userDetails: UserDetails) {
        //let's make hardcoded user abc2@abc.com,
        //if user tries to register another account on that email,
        //it will be rejected
        let err: IDetailedError<string[]>;
        return new Promise<AuthMock>((resolve, reject) => {
            if(userDetails.email == "abc2@abc.com") {
                this.authenticated = false;
                err.details = ["conflict_email"];
                reject(err);
            } else if(userDetails.email == "" || userDetails.email == null) {
                this.authenticated = false;
                err.details = ["required_email"];
                reject(err); 
            } else if(userDetails.password == "" || userDetails.password == null) {
                this.authenticated = false;
                err.details = ["required_password"];
                reject(err); 
            } else if(userDetails.email == "abcdef" || userDetails.email == null) {
                this.authenticated = false;
                err.details = ["invalid_email"];
                reject(err); 
            } else {
                resolve();
            }
        });
    }
}