import 'reflect-metadata';
import { container, singleton } from "tsyringe";
import { TrainingsComponent } from '../components/trainings/trainings.component';

@singleton()
class Trainings {
    constructor(
        protected trainingsComponent: TrainingsComponent,
    ) {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";

        document.body.append(
            this.trainingsComponent.rootElement
        );
    }
}

container.register("BundleName", {
    useValue: "options",
});

container.resolve(Trainings);