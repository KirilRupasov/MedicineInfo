export class AlertCtrlMock {
    constructor() {

    }

    create(message: any) {
        return new AlertMock(message.title, message.subTitle);
    }
}

export class AlertMock {
    title: string;
    subTitle: string;

    constructor(title: string, subTitle: string) {
        this.title = title;
        this.subTitle = subTitle;
    }

    present() {
        
    }
}