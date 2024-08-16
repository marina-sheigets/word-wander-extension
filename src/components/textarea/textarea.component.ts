import { injectable } from "tsyringe";
import { I18nService } from "../../services/i18n/i18n.service";
import { i18nKeys } from "../../services/i18n/i18n-keys";

@injectable()
export class TextareaComponent {
    rootElement = document.createElement('textarea');

    constructor(
        protected i18n: I18nService,
    ) {
        this.rootElement = document.createElement('textarea');
        this.rootElement.style.resize = 'none';
    }

    setPlaceholder(key: i18nKeys) {
        this.i18n.follow(key, (text) => {
            this.rootElement.placeholder = text;
        });
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