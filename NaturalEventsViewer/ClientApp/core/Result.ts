export default class Result<T> {
    public value: T;
    public error: string;
    
    constructor(value: T, error: string) {
        this.value = value;
        this.error = error;
    }
}