import 'reflect-metadata';
import { container, singleton } from "tsyringe";
import { TrainingsComponent } from '../components/trainings/trainings.component';
import { WordTranslationTrainingComponent } from '../components/trainings/word-translation-training/word-translation-training.component';
import { StartTrainingPopup } from '../components/popups/start-training/start-training-popup.component';

@singleton()
class Trainings {
    constructor(
        protected trainingsComponent: TrainingsComponent,
        protected startTrainingPopup: StartTrainingPopup,
        protected wordTranslationTraining: WordTranslationTrainingComponent
    ) {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";

        document.body.append(
            this.trainingsComponent.rootElement,
            this.startTrainingPopup.rootElement,
            this.wordTranslationTraining.rootElement
        );
    }
}

container.register("BundleName", {
    useValue: "options",
});

container.resolve(Trainings);