import { singleton } from "tsyringe";
import { ToolbarButtonComponent } from "../../components/toolbar-button/toolbar-button.component";

@singleton()
export class ToolbarButtonService {
    private buttons: ToolbarButtonComponent[] = [];

    constructor() { }


    public registerButton(button: ToolbarButtonComponent) {
        this.buttons.push(button);
    }

    public setActiveButton(activeButton: ToolbarButtonComponent) {
        this.buttons.forEach(button => {
            if (button !== activeButton) {
                button.unsetActive();
            }
        });
        activeButton.setActive();
    }
}