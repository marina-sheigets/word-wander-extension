import 'reflect-metadata';
import { container } from "tsyringe";

class Trainings {
    constructor() {
        console.log("Trainings");
    }
}

container.register("BundleName", {
    useValue: "options",
});

container.resolve(Trainings);