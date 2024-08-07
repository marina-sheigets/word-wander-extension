import 'reflect-metadata';
import { container, singleton } from "tsyringe";

@singleton()
export class Background {
    constructor() {
    }
}

container.register('BundleName', {
    useValue: 'background',
});

container.resolve(Background);
