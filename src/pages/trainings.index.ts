import 'reflect-metadata';
import { container, singleton } from "tsyringe";
import { TrainingsComponent } from '../components/trainings/trainings.component';
import { WordTranslationTrainingComponent } from '../components/trainings/word-translation-training/word-translation-training.component';
import { StartTrainingPopup } from '../components/popups/start-training/start-training-popup.component';
import { CloseTrainingPopup } from '../components/popups/close-training/close-training-popup.component';
import { MessengerService } from '../services/messenger/messenger.service';
import { Messages } from '../constants/messages';
import { TranslationWordTrainingComponent } from '../components/trainings/translation-word-training/translation-word-training.component';
import { RepeatingTrainingComponent } from '../components/trainings/repeating-training/repeating-training.component';
import { WordConstructionTrainingComponent } from '../components/trainings/word-construction/word-construction-training.component';
import { ListeningTrainingComponent } from '../components/trainings/listening/listening-training.component';
import { AudioChallengeTrainingComponent } from '../components/trainings/audio-challenge/audio-challenge-training.component';
import { SignInPopupComponent } from '../components/popups/sign-in/sign-in.component';

@singleton()
class Trainings {
    constructor(
        protected trainingsComponent: TrainingsComponent,
        protected startTrainingPopup: StartTrainingPopup,
        protected closeTrainingPopup: CloseTrainingPopup,
        protected wordTranslationTraining: WordTranslationTrainingComponent,
        protected translationWordTraining: TranslationWordTrainingComponent,
        protected repeatingTrainingComponent: RepeatingTrainingComponent,
        protected wordConstructionTrainingComponent: WordConstructionTrainingComponent,
        protected listeningTraining: ListeningTrainingComponent,
        protected audioChallengeTraining: AudioChallengeTrainingComponent,
        protected signInPopup: SignInPopupComponent,
        protected messenger: MessengerService,
    ) {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";

        document.body.append(
            this.signInPopup.rootElement,
            this.trainingsComponent.rootElement,
            this.startTrainingPopup.rootElement,
            this.closeTrainingPopup.rootElement,
            this.wordTranslationTraining.rootElement,
            this.translationWordTraining.rootElement,
            this.repeatingTrainingComponent.rootElement,
            this.wordConstructionTrainingComponent.rootElement,
            this.audioChallengeTraining.rootElement,
            this.listeningTraining.rootElement,
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