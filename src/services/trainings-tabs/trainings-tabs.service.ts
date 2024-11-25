import { singleton } from "tsyringe";
import { Informer } from "../informer/informer.service"
import { TrainingsTab } from "../../types/TrainingsTabs";
import { MessengerService } from "../messenger/messenger.service";
import { Messages } from "../../constants/messages";

@singleton()
export class TrainingsTabsService {
    private currentTab: TrainingsTab = TrainingsTab.Trainings;
    public onTabChange = new Informer<TrainingsTab>();
    constructor(
        protected messenger: MessengerService,
    ) {
        this.messenger.subscribe(Messages.ChangeTab, this.changeTab.bind(this));
    }

    changeTab(tabName: TrainingsTab) {
        this.currentTab = tabName;
        this.onTabChange.inform(tabName);
    }

    getCurrentTab() {
        return this.currentTab;
    }
}