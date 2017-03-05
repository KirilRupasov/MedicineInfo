export class ModalCtrlMock {
    constructor() {

    }

    create(modalClass: any, params: any) {
        return new ModalMock(modalClass);
    }
}

export class ModalMock {
    NavParams: any;

    constructor(params: any) {
       this.NavParams = params; 
    }

    present() {

    }
}