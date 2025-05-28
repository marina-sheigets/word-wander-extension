import { injectable } from "tsyringe";
import { BaseComponent } from "../../../base-component/base-component";
import * as styles from './collection-tools.component.css';
import { IconComponent } from "../../../icon/icon.component";
import { MessengerService } from "../../../../services/messenger/messenger.service";
import { IconName } from "../../../../types/IconName";
import { Informer } from "../../../../services/informer/informer.service";
import { Messages } from "../../../../constants/messages";

@injectable()
export class CollectionToolsComponent extends BaseComponent {
    onCollectionCollapsed = new Informer<boolean>();

    private collectionId = "";
    private collectionName = "";

    constructor(
        protected changeCollectionNameButton: IconComponent,
        protected removeCollectionButton: IconComponent,
        protected collapseCollectionButton: IconComponent,
        protected messenger: MessengerService,

    ) {
        super(styles);

        this.uncollapse();
    }

    public initTools(collectionId: string, collectionName: string) {
        this.collectionId = collectionId;
        this.collectionName = collectionName;

        this.collapseCollectionButton.setIcon(IconName.ChevronDown);

        this.collapseCollectionButton.rootElement.addEventListener('click', () => {
            if (this.collapseCollectionButton.rootElement.classList.contains(styles.arrowUp)) {
                this.collapse();
            } else {
                this.uncollapse();
            }
        });


        this.rootElement.append(this.collapseCollectionButton.rootElement);

        // cannot remove Default collection, so we cannot add remove button to it
        if (this.collectionName === 'Default') {
            return;
        }

        this.changeCollectionNameButton.setIcon(IconName.Edit);
        this.changeCollectionNameButton.rootElement.addEventListener('click', () => {
            this.messenger.send(
                Messages.ShowChangeCollectionNamePopup,
                { collectionId: this.collectionId, name: this.collectionName });
        });

        this.removeCollectionButton.setIcon(IconName.Delete);
        this.removeCollectionButton.rootElement.addEventListener('click', () => {
            this.messenger.send(Messages.ShowRemoveCollectionPopup, { collectionId: this.collectionId });
        });

        this.rootElement.prepend(this.changeCollectionNameButton.rootElement, this.removeCollectionButton.rootElement);

    }

    collapse() {
        this.onCollectionCollapsed.inform(true);
        this.collapseCollectionButton.rootElement.classList.remove(styles.arrowUp);
    }

    uncollapse() {
        this.onCollectionCollapsed.inform(false);
        this.collapseCollectionButton.rootElement.classList.add(styles.arrowUp);
    }
}