import { singleton } from "tsyringe";


@singleton()
export class IconService {
    constructor() { }

    init(iconName: string, color = 'white') {
        const icon = document.createElement('span');
        icon.classList.add('material-symbols-outlined');
        icon.textContent = iconName;
        icon.style.color = color;
        return icon
    }

}