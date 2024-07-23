import 'reflect-metadata';
import { container, inject, singleton } from "tsyringe";
import { ShadowWrapper } from "./components/wrappers/shadow-wrapper.component";
import { MinimizedToolbarComponent } from './components/toolbars/minimized-toolbar/minimized-toolbar.component';
import { getCssLink } from './utils/getCssLink';
import { DraggableToolbarComponent } from './components/toolbars/draggable-toolbar/draggable-toolbar.component';
import { addMaterialIcons } from './utils/getMaterialIcons';


@singleton()
class Entry {
    constructor(
        protected draggableToolbar: DraggableToolbarComponent,
        protected minimizedToolbar: MinimizedToolbarComponent,
        @inject("Shadow") shadow: ShadowRoot,
    ) {
        const element = document.createElement('div');
        element.classList.add("wordWander")
        shadow.append(
            draggableToolbar.rootElement,
            //minimizedToolbar.rootElement,
            addMaterialIcons(),
            getCssLink(`chrome-extension://ddglnclgkdlmnikgndlnionilakomjdd/top.css`),
        );

        document.body.append(
            addMaterialIcons(),
            shadowWrapper
        );

    }
}


customElements.define('word-wander', ShadowWrapper)
const shadowWrapper = new ShadowWrapper();

const shadow = shadowWrapper.attachShadow({ mode: 'closed' });

container.register('Shadow', {
    useValue: shadow,
});

container.register('BundleName', {
    useValue: 'top',
});

container.resolve(Entry);