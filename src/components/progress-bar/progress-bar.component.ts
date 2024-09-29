import { injectable } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";
import * as styles from "./progress-bar.component.css";

@injectable()
export class ProgressBarComponent extends BaseComponent {
    private numberOfSections = 0;

    constructor() {
        super(styles);
    }

    setNumberOfSections(numberOfSections: number) {
        this.numberOfSections = numberOfSections;
    }

    addWrongSection() {
        const section: HTMLDivElement = document.createElement('div');
        section.style.width = `${this.rootElement.offsetWidth / this.numberOfSections}px`;
        section.classList.add(styles.wrongSection);
        this.rootElement.append(section);
    }

    addCorrectSection() {
        const section: HTMLDivElement = document.createElement('div');
        section.style.width = `${this.rootElement.offsetWidth / this.numberOfSections}px`;
        section.classList.add(styles.correctSection);
        this.rootElement.append(section);
    }

    clear() {
        this.rootElement.innerHTML = '';
    }

}