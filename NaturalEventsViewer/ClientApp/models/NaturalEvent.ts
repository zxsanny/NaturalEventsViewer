enum GeometryType {
    point = 0,
    polygon = 1
}

interface NaturalEventCatecory {
    id: string;
    title: string;
}

interface NaturalEventSource {
    id: string;
    url: URL;
}

interface NaturalEventGeometry {
    date: Date;
    type: GeometryType;
    coordinates: object; 
}

export enum NaturalEventsOrder {
    Date = 0,
    Status = 1,
    Category = 2
}

export interface NaturalEvent {
    id: string;
    title: string;
    description: string;
    link: URL;
    closed: Date | null;
    categories: NaturalEventCatecory[];
    sources: NaturalEventSource[];
    geometries: NaturalEventGeometry[];
    isOpen: boolean;
}