import 'reflect-metadata';
import { container, inject, singleton } from "tsyringe";
import { ShadowWrapper } from "./components/wrappers/shadow-wrapper.component";
import { MinimizedToolbarComponent } from './components/toolbars/minimized-toolbar/minimized-toolbar.component';
import { getCssLink } from './utils/getCssLink';
import { DraggableToolbarComponent } from './components/toolbars/draggable-toolbar/draggable-toolbar.component';
import { SettingsPopupComponent } from './components/popups/settings-popup/settings-popup.component';
import { NotFoundPopupComponent } from './components/popups/not-found/not-found.component';
import { SearchErrorPopupComponent } from './components/popups/search-error/search-error.component';
import { SignInPopupComponent } from './components/popups/sign-in/sign-in.component';
import { ResetPasswordPopupComponent } from './components/popups/reset-password/reset-password-popup.component';
import { ResetLinkSentPopupComponent } from './components/popups/reset-link-sent/reset-link-sent-popup.component';
import { ReportPopupComponent } from './components/popups/report/report-popup.component';
import { SignOutPopupComponent } from './components/popups/sign-out/sign-out-popup.component';
import { DeleteAccountPopupComponent } from './components/popups/delete-account/delete-account-popup.component';
import { SelectCollectionPopup } from './components/popups/select-collection/select-collection.popup';


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
        protected resetLinkSentPopup: ResetLinkSentPopupComponent,
        protected reportPopupComponent: ReportPopupComponent,
        protected signOutPopup: SignOutPopupComponent,
        protected deleteAccountPopup: DeleteAccountPopupComponent,
        protected selectCollectionPopup: SelectCollectionPopup,
        @inject("Shadow") shadow: ShadowRoot,
    ) {
        const element = document.createElement('div');
        element.classList.add("wordWander");

        const topCss = getCssLink(`chrome-extension://${process.env.EXTENSION_ID}/top.css`);

        shadow.append(
            topCss,
        );

        topCss.onload = () => {
            shadow.append(
                draggableToolbar.rootElement,
                minimizedToolbar.rootElement,
                settingsPopupComponent.rootElement,
                notFoundPopup.rootElement,
                searchErrorPopupComponent.rootElement,
                signInPopupComponent.rootElement,
                resetPasswordPopupComponent.rootElement,
                resetLinkSentPopup.rootElement,
                reportPopupComponent.rootElement,
                signOutPopup.rootElement,
                deleteAccountPopup.rootElement,
                selectCollectionPopup.rootElement
            );
        }

        document.body.append(
            shadowWrapper,
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