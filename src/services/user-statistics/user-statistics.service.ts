import { singleton } from "tsyringe";
import { URL } from "../../constants/urls";
import { StatisticsData } from "../../types/StatisticsData";
import { HttpService } from "../http/http.service";

@singleton()
export class UserStatisticsService {

    constructor(
        protected httpService: HttpService
    ) { }

    public updateStatistics(statisticsData: StatisticsData) {
        this.httpService.post(URL.statistics.updateStatistics, statisticsData);
    }

    public async getStatistics() {
        return await this.httpService.get(URL.statistics.getStatistics);
    }
}