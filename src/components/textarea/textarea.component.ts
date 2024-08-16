import { injectable } from "tsyringe";

@injectable()
export class TextareaComponent {
    rootElement = document.createElement('textarea');

    constructor() {
        this.rootElement = document.createElement('textarea');
        this.rootElement.style.resize = 'none';
    }

    setPlaceholder(placeholder: string) {
        this.rootElement.placeholder = placeholder;
    }

    setRows(rows: number) {
        this.rootElement.rows = rows;
    }

    setCols(cols: number) {
        this.rootElement.cols = cols;
    }

    getValue() {
        return this.rootElement.value;
    }

    setValue(value: string) {
        this.rootElement.value = value;
    }
}