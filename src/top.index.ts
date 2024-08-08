import 'reflect-metadata';
import { container, inject, singleton } from "tsyringe";
import { ShadowWrapper } from "./components/wrappers/shadow-wrapper.component";
import { MinimizedToolbarComponent } from './components/toolbars/minimized-toolbar/minimized-toolbar.component';
import { getCssLink } from './utils/getCssLink';
import { DraggableToolbarComponent } from './components/toolbars/draggable-toolbar/draggable-toolbar.component';
import { addMaterialIcons } from './utils/getMaterialIcons';
import { SettingsPopupComponent } from './components/popups/settings-popup/settings-popup.component';
import { NotFoundPopupComponent } from './components/popups/not-found/not-found.component';
import { SearchErrorPopupComponent } from './components/popups/search-error/search-error.component';
import { SignInPopupComponent } from './components/popups/sign-in/sign-in.component';
import { ResetPasswordPopupComponent } from './components/popups/reset-password/reset-password-popup.component';


@singleton()
class Entry {
    constructor(
        protected draggableToolbar: DraggableToolbarComponent,
        protected minimizedToolbar: MinimizedToolbarComponent,
        protected settingsPopupComponent: SettingsPopupComponent,
        protected notFoundPopup: NotFoundPopupComponent,
        protected searchErrorPopupComponent: SearchErrorPopupComponent,
        protected signInPopupComponent: SignInPopupComponent,
        protected resetPasswordPopupComponent: ResetPasswordPopupComponent,
        @inject("Shadow") shadow: ShadowRoot,
    ) {
        const element = document.createElement('div');
        element.classList.add("wordWander")
        shadow.append(
            draggableToolbar.rootElement,
            minimizedToolbar.rootElement,
            settingsPopupComponent.rootElement,
            notFoundPopup.rootElement,
            searchErrorPopupComponent.rootElement,
            signInPopupComponent.rootElement,
            resetPasswordPopupComponent.rootElement,
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