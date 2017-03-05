export class UserMock {
    details: any;
    date_of_birth: string;
    smoker: string;
    gender: string;

    constructor() {
        this.details = {
            email : "abc@abc.com"
        };
    }

    get(target: string, default_val: any) {
        if(target == "date_of_birth") {
            return this.date_of_birth;
        } else if(target == "smoker") {
            return this.smoker;
        } else if(target == "gender") {
            return this.gender;
        } else {
            return default_val;
        }
    }

    set(target: string, value: string) {
         if(target == "date_of_birth") {
            this.date_of_birth = value;
        } else if(target == "smoker") {
            this.smoker = value;
        } else if(target == "gender") {
            this.gender = value;
        }
    }

    save() {
        
    }
}