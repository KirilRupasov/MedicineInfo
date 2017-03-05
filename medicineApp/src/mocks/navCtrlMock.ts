export class NavCtrlMock {
    page: any;
    params: any;

    constructor() {

    }

    push(page: any, params?: any) {
        this.page = page;
        if(params) {
            this.params = params;
        }
    }

    first() {
        return this.params.title;
    }

    setRoot(page: any) {
        
    }
}