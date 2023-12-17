export class Toast
{
    message: string = '';
    type: ToastType = ToastType.INFO;
    seconds: number = 3000;
    isClosed: boolean = false;

    constructor(message: string, type: ToastType)
    {
        this.message = message;
        this.type = type;
    }
}
export enum ToastType
{
    INFO,
    WARNING,
    ERROR
}