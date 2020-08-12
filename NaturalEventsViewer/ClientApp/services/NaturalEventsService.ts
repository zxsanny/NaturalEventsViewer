import Result from "@Core/Result";
import { ServiceBase } from "@Core/ServiceBase";
import { NaturalEvent, NaturalEventsOrder, OrderDirection } from "../models/NaturalEvent";
import moment from "moment";

export default class NaturalEventsService extends ServiceBase {
    public async search(orderBy?: NaturalEventsOrder, orderDirection?: OrderDirection, date?: Date, isOpen?: boolean, category?: string): Promise<Result<NaturalEvent[]>> {
        const url = `/EONET/events?orderBy=${orderBy || ''}` +
            `&orderDirection=${orderDirection || ''}` +
            `&date=${date ? moment(date).format('YYYY-MM-DD') : ''}` +
            `&isOpen=${isOpen === false ? 'false' : isOpen || ''}` +
            `&category=${category || ''}`;
        return await this.requestJson<NaturalEvent[]>({url: url, method: "GET" });
    }
}