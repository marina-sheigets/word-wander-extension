import { singleton } from "tsyringe";
import { i18nKeys } from "../../../services/i18n/i18n-keys";
import { I18nService } from "../../../services/i18n/i18n.service";
import { MessengerService } from "../../../services/messenger/messenger.service";
import { SubmitButton } from "../../button/submit/submit-button.component";
import { PopupComponent } from "../popup.component";
import * as styles from "./delete-collection.popup.css";
import { Messages } from "../../../constants/messages";
import { CollectionsService } from "../../../services/collections/collections.service";

@singleton()
export class DeleteCollectionPopup extends PopupComponent {
    private content = document.createElement('div');
    private errorMessage = document.createElement('div');
    private description = document.createElement("div");

    private collectionId = "";
    private collectionName = "";

    constructor(
        protected i18n: I18nService,
        protected submitButton: SubmitButton,
        protected messenger: MessengerService,
        protected collectionsService: CollectionsService
    ) {
        super(i18n);

        this.setTitle(i18nKeys.RemoveCollection);

        this.content.classList.add(styles.content);
        this.errorMessage.classList.add(styles.errorMessage);

        this.content.append(
            this.description,
            this.submitButton.rootElement,
            this.errorMessage
        );

        this.setContent(this.content);

        this.messenger.subscribe(Messages.ShowRemoveCollectionPopup, this.showPopup.bind(this));

        this.hide();

        this.submitButton.onClick.subscribe(this.removeCollection.bind(this));
    }

    private showPopup({ collectionId, collectionName }: { collectionId: string, collectionName: string }) {
        this.clearErrorMessage();

        this.collectionId = collectionId;
        this.collectionName = collectionName;

        this.i18n.follow(i18nKeys.RemoveCollectionDescription, (value) => {
            this.description.textContent = value;
        });

        const span = document.createElement("span");
        span.style.fontWeight = "600";
        span.textContent = " " + this.collectionName + "?";

        this.description.append(
            span
        )

        this.show();
    }

    private removeCollection() {
        this.collectionsService.removeCollection(this.collectionId)
            .then(() => {
                this.hide();
            })
            .catch((e) => {
                if (e.message) {
                    this.errorMessage.textContent = e.message;
                } else {
                    this.i18n.follow(i18nKeys.SomethingWentWrong, (value) => {
                        this.errorMessage.textContent = value;
                    });
                }
            })
    }

    private clearErrorMessage() {
        this.errorMessage.textContent = "";
    }
}