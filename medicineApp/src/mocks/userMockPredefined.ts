export class UserMockPredefined {
    date_of_birth: string;
    smoker: string;
    gender: string;

    constructor() {
        this.date_of_birth = "07/06/1993";
        this.smoker = "no";
        this.gender = "male"
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
}