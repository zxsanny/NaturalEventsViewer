import Result from "@Core/Result";
import { ServiceBase } from "@Core/ServiceBase";
import { NaturalEvent, NaturalEventFilters } from "../models/NaturalEvent";
import moment from 'moment';

export default class NaturalEventsService extends ServiceBase {
    public async search(filter: NaturalEventFilters): Promise<Result<NaturalEvent[]>> {
        const data = {
            ...filter,
            date: filter?.date ? moment(filter?.date).format('YYYY-MM-DD') : null
        };
        return await this.requestJson<NaturalEvent[]>({ url: '/EONET/events', data: data, method: "GET" });
    }
}