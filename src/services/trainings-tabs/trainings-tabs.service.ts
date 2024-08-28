import { singleton } from "tsyringe";
import { Informer } from "../informer/informer.service"
import { TrainingsTab } from "../../types/TrainingsTabs";

@singleton()
export class TrainingsTabsService {
    private currentTab: TrainingsTab = TrainingsTab.Trainings;
    public onTabChange = new Informer<TrainingsTab>();
    constructor() {

    }

    changeTab(tabName: TrainingsTab) {
        this.currentTab = tabName;
        this.onTabChange.inform(tabName);
    }

    getCurrentTab() {
        return this.currentTab;
    }
}