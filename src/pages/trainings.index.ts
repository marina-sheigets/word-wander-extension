import 'reflect-metadata';
import { container, singleton } from "tsyringe";
import { TrainingsComponent } from '../components/trainings/trainings.component';
import { WordTranslationTrainingComponent } from '../components/trainings/word-translation-training/word-translation-training.component';

@singleton()
class Trainings {
    constructor(
        protected trainingsComponent: TrainingsComponent,
        protected wordTranslationTraining: WordTranslationTrainingComponent
    ) {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";

        document.body.append(
            this.trainingsComponent.rootElement,
            this.wordTranslationTraining.rootElement
        );
    }
}

container.register("BundleName", {
    useValue: "options",
});

container.resolve(Trainings);