

export abstract class BaseComponent {
    public rootElement: HTMLElement;

    constructor(styles?: { [key: string]: string }) {
        this.rootElement = this.createRoot();
        if (styles) {
            this.applyRootStyle(styles);
        }
    }

    protected createRoot(): HTMLElement {
        return document.createElement('div');
    };

    protected applyRootStyle(styles: { [id: string]: string }) {
        this.addClassNamesToComponents(styles);
        if (styles.hasOwnProperty('rootClassName')) {
            this.rootElement.classList.add(styles.rootClassName);
        }
    }

    protected addClassNamesToComponents(styles: { [id: string]: string }): void {
        for (let propName in this) {
            let propertyValue = this[propName];
            if (propertyValue instanceof BaseComponent && styles[propName]) {
                propertyValue.rootElement.classList.add(styles[propName]);
            }
            else if (propertyValue instanceof Element && styles[propName]) {
                propertyValue.classList.add(styles[propName]);
            }
        }
    }

    htmlToElement(html: string): HTMLElement {
        let tempWrapper = document.createElement('div');

        tempWrapper.innerHTML = this.secureHtml(html);
        return tempWrapper.firstElementChild as HTMLElement;
    }

    protected secureHtml(html: string): string {
        const htmlPolicy = (window as any).trustedTypes.createPolicy("policy", {
            createHTML: (string: string) => string,
        });

        return htmlPolicy.createHTML(html);
    }
}