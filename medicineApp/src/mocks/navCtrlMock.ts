export class NavCtrlMock {
    constructor() {

    }

    push(page: any) {
        window.alert("pushed") ;
    }

    setRoot(page: any) {
        window.alert("root set");
    }
}