
export class TextManagerService {
    constructor() { }

    getSelectedTextOnPage(): string {
        const selection = window.getSelection();

        return selection ? selection.toString() : '';
    }

}