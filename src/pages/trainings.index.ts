import 'reflect-metadata';
import { container, singleton } from "tsyringe";
import { TrainingsComponent } from '../components/trainings/trainings.component';
import { WordTranslationTrainingComponent } from '../components/trainings/word-translation-training/word-translation-training.component';
import { StartTrainingPopup } from '../components/popups/start-training/start-training-popup.component';
import { CloseTrainingPopup } from '../components/popups/close-training/close-training-popup.component';
import { MessengerService } from '../services/messenger/messenger.service';
import { Messages } from '../constants/messages';

@singleton()
class Trainings {
    constructor(
        protected trainingsComponent: TrainingsComponent,
        protected startTrainingPopup: StartTrainingPopup,
        protected closeTrainingPopup: CloseTrainingPopup,
        protected wordTranslationTraining: WordTranslationTrainingComponent,
        protected messenger: MessengerService,
    ) {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";

        document.body.append(
            this.trainingsComponent.rootElement,
            this.startTrainingPopup.rootElement,
            this.closeTrainingPopup.rootElement,
            this.wordTranslationTraining.rootElement
        );

        this.messenger.subscribe(Messages.ChangeExtensionPageTitle, (newTitle: string) => {
            document.title = "WordWander | " + newTitle;
        });
    }
}

container.register("BundleName", {
    useValue: "options",
});

container.resolve(Trainings);