
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

export enum NaturalEventsColumn {
    Date = 1,
    Title = 2,
    Status = 3,
    Category = 4,
    Source = 5
}

export enum OrderDirection {
    ASC = 1,
    DESC = 2,
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

export interface NaturalEventFilters {
    date?: Date;
    isOpen?: boolean;
    category?: string;
    title?: string;
    source?: string;
    orderBy?: NaturalEventsColumn;
    orderDirection?: OrderDirection;
}
