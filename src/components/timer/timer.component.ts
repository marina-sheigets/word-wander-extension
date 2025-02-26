import { injectable } from "tsyringe";
import { Informer } from "../../services/informer/informer.service";
import { IconName } from "../../types/IconName";
import { wait } from "../../utils/wait";
import { BaseComponent } from "../base-component/base-component";
import { IconComponent } from "../icon/icon.component";
import * as styles from './timer.component.css';
import { ComponentsFactory } from "../factories/component.factory.";

@injectable()
export class TimerComponent extends BaseComponent {
    private content = document.createElement('div');
    private timer = document.createElement('div');
    private interval: NodeJS.Timeout | null = null;
    public onTimerEnd = new Informer();

    constructor(
        protected componentsFactory: ComponentsFactory
    ) {
        super(styles);

        this.content.classList.add(styles.content);
        this.timer.classList.add(styles.timer);

        this.content.append(this.timer);
        this.rootElement.append(this.content);

        this.onTimerEnd.subscribe(() => { this.interrupt(false); });
    }

    start(seconds: number) {
        this.timer.textContent = seconds.toString();
        this.rootElement.classList.remove(styles.failed);

        this.interval = setInterval(() => {
            seconds--;

            if (seconds <= 0) {
                clearInterval(this.interval as NodeJS.Timeout);
                this.timer.textContent = '0';
                this.onTimerEnd.inform();
            } else {
                this.timer.textContent = seconds.toString();
            }
        }, 1000);
    }

    public async interrupt(isSuccess: boolean, timeout: number = 0) {
        this.timer.textContent = '';
        clearInterval(this.interval as NodeJS.Timeout);
        if (isSuccess) {
            const tickSVG = this.componentsFactory.createComponent(IconComponent);

            tickSVG.setIcon(IconName.Tick);
            this.timer.append(tickSVG.rootElement);

            await wait(timeout);
        } else {
            const crossSVG = this.componentsFactory.createComponent(IconComponent);

            crossSVG.setIcon(IconName.Close);
            this.timer.append(crossSVG.rootElement);

            this.rootElement.classList.add(styles.failed);
        }
    }
}