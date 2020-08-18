import * as React from "react";
import { NaturalEventsColumn, OrderDirection, NaturalEventFilters } from "../../models/NaturalEvent";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

export interface Props {
    column: NaturalEventsColumn;
    title: string;
    filter: NaturalEventFilters;
    value: string | Date;
    onOrderClick: (orderBy: NaturalEventsColumn, orderDirection: OrderDirection) => void;
    onFilterChange: (input: string | Date) => void;
    type?: string;
}

const GridColumnFilter: React.FC<Props> =
    ({column, title, filter, value, onOrderClick, onFilterChange, type = "string" }) => {
        const orderClicked = (order: NaturalEventsColumn) => {
            let orderDirection = OrderDirection.ASC;
            let orderBy = order;
            if (filter?.orderBy === orderBy) {
                switch (filter?.orderDirection) {
                    case OrderDirection.ASC: { orderDirection = OrderDirection.DESC; break; }
                    case OrderDirection.DESC: {
                        orderDirection = null;
                        orderBy = null;
                        break;
                    }
                }
            }
            onOrderClick(orderBy, orderDirection);
        }

        return (
            <th>
                <span
                    onClick={() => orderClicked(column)}>
                    {title}
                </span>
                {filter?.orderBy === column && filter?.orderDirection === OrderDirection.ASC ? (<FontAwesomeIcon icon={faSortUp} />) : null}
                {filter?.orderBy === column && filter?.orderDirection === OrderDirection.DESC ? (<FontAwesomeIcon icon={faSortDown} />) : null}
                {type === "date" ? (
                    <DatePicker
                        selected={value}
                        onChange={onFilterChange}
                        placeholderText={`${NaturalEventsColumn[column]} filter`}
                    />
                ) : (
                    <Form.Control size="sm"
                        value={value as string}
                        type="text"
                        placeholder={`${NaturalEventsColumn[column]} filter`}
                        onChange={(input) => onFilterChange(input.target.value)}
                    />
                )}
            </th>
        );
    };

export default GridColumnFilter;