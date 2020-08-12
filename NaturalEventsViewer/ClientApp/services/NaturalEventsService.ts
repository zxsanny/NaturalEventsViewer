import Result from "@Core/Result";
import { ServiceBase } from "@Core/ServiceBase";
import { NaturalEvent, NaturalEventsOrder } from "../models/NaturalEvent";

export default class NaturalEventsService extends ServiceBase {
    public async search(orderBy?: NaturalEventsOrder, date?: Date, isOpen?: boolean, category?: string): Promise<Result<NaturalEvent[]>> {
        return await this.requestJson<NaturalEvent[]>({
            url: `/EONET/events?orderBy=${orderBy || ''}&date=${date || ''}&isOpen=${isOpen || ''}&category=${category || ''}`,
            method: "GET"
        });
    }
}