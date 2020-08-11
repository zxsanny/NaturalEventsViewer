import Result from "@Core/Result";
import { ServiceBase } from "@Core/ServiceBase";
import { NaturalEvent } from "../models/NaturalEvent";

export default class NaturalEventsService extends ServiceBase {

    public async search(term: string = null): Promise<Result<NaturalEvent[]>> {
        if (term === null) {
            term = "";
        }
        var result = await this.requestJson<NaturalEvent[]>({
            url: `/EONET/events/=${term}`,
            method: "GET"
        });
        return result;
    }

}