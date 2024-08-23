import { SettingsTab } from "./SettingsTabs";
import { TrainingsTab } from "./TrainingsTabs";

export interface SettingsTabsButton {
    label: SettingsTab,
    component: HTMLElement
}

export interface TrainingsTabsButton {
    label: TrainingsTab,
    component: HTMLElement
}