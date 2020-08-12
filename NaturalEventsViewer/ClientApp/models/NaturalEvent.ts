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
    url: string;
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

export enum OrderDirection {
    ASC = 0,
    DESC = 1
}

export interface NaturalEvent {
    id: string;
    title: string;
    description: string;
    link: string;
    closed: Date | null;
    categories: NaturalEventCatecory[];
    sources: NaturalEventSource[];
    geometries: NaturalEventGeometry[];
    isOpen: boolean;
}