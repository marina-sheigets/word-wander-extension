import { singleton } from "tsyringe";


@singleton()
export class IconService {
    constructor() { }

    init(iconName: string) {
        const icon = document.createElement('span');
        icon.classList.add('material-symbols-outlined');
        icon.textContent = iconName;
        return icon
    }

}