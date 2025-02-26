import { container, InjectionToken, singleton } from "tsyringe";
import { BaseComponent } from "../base-component/base-component";

@singleton()
export class ComponentsFactory {

    createComponent<T extends BaseComponent>(type: InjectionToken<T>, cssClass: string = ''): T {
        let component = container.resolve(type);

        if (cssClass) {
            component.rootElement.classList.add(cssClass);
        }

        return component;
    }
}
