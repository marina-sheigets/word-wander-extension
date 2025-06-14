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
import { NotEnoughWordsPopup } from '../components/popups/not-enough-words/not-enough-words-popup.component';
import { SendWordsOnTrainingPopup } from '../components/popups/send-words-on-training/send-words-on-training-popup.component';
import { TrainingResultPopup } from '../components/popups/training-result/training-result-popup.component';
import { CustomTranslationPopup } from '../components/popups/custom-translation/custom-translation.popup';
import { EditWordPopup } from '../components/popups/edit-word/edit-word.popup';
import { EditCollectionPopup } from '../components/popups/edit-collection/edit-collection.popup';
import { DeleteCollectionPopup } from '../components/popups/delete-collection/delete-collection.popup';
import { SelectCollectionPopup } from '../components/popups/select-collection/select-collection.popup';

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
        protected notEnoughWordsPopup: NotEnoughWordsPopup,
        protected sendWordsOnTrainingsPopup: SendWordsOnTrainingPopup,
        protected trainingResultPopup: TrainingResultPopup,
        protected customTranslationPopup: CustomTranslationPopup,
        protected editWordPopup: EditWordPopup,
        protected editCollectionPopup: EditCollectionPopup,
        protected deleteCollectionPopup: DeleteCollectionPopup,
        protected selectCollectionPopup: SelectCollectionPopup,
        protected messenger: MessengerService,
    ) {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";

        document.body.append(
            this.trainingResultPopup.rootElement,
            this.sendWordsOnTrainingsPopup.rootElement,
            this.notEnoughWordsPopup.rootElement,
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
            this.customTranslationPopup.rootElement,
            this.editWordPopup.rootElement,
            this.editCollectionPopup.rootElement,
            this.selectCollectionPopup.rootElement,
            this.deleteCollectionPopup.rootElement
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