import "@Styles/main.scss";
import * as React from "react";
import { Helmet } from "react-helmet";
import { RouteComponentProps, withRouter } from "react-router";
import * as naturalEventsStore from "@Store/naturalEventStore";
import { withStore } from "@Store/index";
import Paginator from "@Components/shared/Paginator";
import { paginate } from "@Utils";
import { Container, ToggleButton, ToggleButtonProps, Table, ToggleButtonGroup, Form } from "react-bootstrap";
import { NaturalEventsColumn, OrderDirection, NaturalEventFilters } from "../models/NaturalEvent";
import moment from "moment";
import GridColumnFilter from "../components/shared/GridColumnFilter";

type Props = typeof naturalEventsStore.actionCreators & naturalEventsStore.NaturalEventsStoreState & RouteComponentProps<{}>;

interface State {
    filter: NaturalEventFilters;
    currentPageNum: number;
    limitPerPage: number;
}

class EventsPage extends React.Component<Props, State> {

    private paginator: Paginator;

    constructor(props: Props) {
        super(props);

        this.state = {
            filter: {
                title: '',
                date: null,
            },
            currentPageNum: 1,
            limitPerPage: 20,
        };

        this.props.search();
    }

    private onChangeSearch = () => {
        this.props.search(this.state.filter);
        this.paginator.setFirstPage();
    }

    private onOpenCloseSelectorChange = (event: React.ChangeEvent<ToggleButtonProps>) =>
        this.setState({
            ...this.state, filter: {
                ...this.state.filter,
                isOpen: event.currentTarget.value === "" ? null : event.target.value === "true"
            }
        }, this.onChangeSearch);

    private onOrderClick = (orderBy: NaturalEventsColumn, orderDirection: OrderDirection) => {
        this.setState({
            ...this.state, filter: {
                ...this.state.filter,
                orderBy: orderBy,
                orderDirection: orderDirection
            }
        }, this.onChangeSearch);
    }

    render() {
        return <Container>
            <Helmet>
                <title>Earth Observatory Natural Events Tracker Viewer</title>
            </Helmet>

            <ToggleButtonGroup
                type="radio"
                name="open-close-selector"
                defaultValue=""
            >
                <ToggleButton 
                    value=""
                    checked={this.state.filter?.isOpen === null}
                    onChange={this.onOpenCloseSelectorChange}>Show all
                </ToggleButton>
                <ToggleButton
                    value={true}
                    checked={this.state.filter?.isOpen === true}
                    onChange={this.onOpenCloseSelectorChange}>Show Open Only
                </ToggleButton>
                <ToggleButton
                    value={false}
                    checked={this.state.filter?.isOpen === false}
                    onChange={this.onOpenCloseSelectorChange}>Show Closed Only
                </ToggleButton>
            </ToggleButtonGroup>

            {// Also could be used react-bootstrap-table here
            }
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <GridColumnFilter
                            column={NaturalEventsColumn.Date}
                            title={"Closed Date"}
                            filter={this.state.filter}
                            value={this.state.filter?.date}
                            onOrderClick={this.onOrderClick}
                            onFilterChange={(input) => this.setState({
                                ...this.state, filter: {
                                    ...this.state.filter, date: input as Date
                                }
                            }, this.onChangeSearch)}
                            type={"date"}
                        />
                        <GridColumnFilter
                            column={NaturalEventsColumn.Title}
                            title={"Title"}
                            filter={this.state.filter}
                            value={this.state.filter?.title}
                            onOrderClick={this.onOrderClick}
                            onFilterChange={(input) => this.setState({
                                ...this.state, filter: {
                                    ...this.state.filter, title: input as string
                                }
                            }, this.onChangeSearch)}
                        />
                        <GridColumnFilter
                            column={NaturalEventsColumn.Category}
                            title={"Categories"}
                            filter={this.state.filter}
                            value={this.state.filter?.category}
                            onOrderClick={this.onOrderClick}
                            onFilterChange={(input) => this.setState({
                                ...this.state, filter: {
                                    ...this.state.filter, category: input as string
                                }
                            }, this.onChangeSearch)}
                        />
                        <GridColumnFilter
                            column={NaturalEventsColumn.Source}
                            title={"Source"}
                            filter={this.state.filter}
                            value={this.state.filter?.source}
                            onOrderClick={this.onOrderClick}
                            onFilterChange={(input) => this.setState({
                                ...this.state, filter: {
                                    ...this.state.filter, source: input as string
                                }
                            }, this.onChangeSearch)}
                        />
                        <th>
                            Coordinates
                        </th>
                    </tr>
                </thead>
                <tbody> {
                    paginate(this.props.collection, this.state.currentPageNum, this.state.limitPerPage)
                            .map(event =>
                                <tr className={event.closed ? "disabled" : ""} key={event.id}>
                                    <td>{!event.closed ? 'Open now' : moment(event.closed).format('YYYY-MM-DD')}</td>
                                    <td><a href={event.link}>{event.title}</a></td>
                                    <td>{event.categories.map(c => c.title).join(', ')}</td>
                                    <td>{event.sources.map(s => <a key={s.id} className="source-event" href={s.url}>{s.id}</a>)}</td>
                                    <td>{event.geometries.map(c =>
                                        <div key={`${event.id} ${c.date.toString()}`}>
                                        </div>
                                    )}
                                    </td>
                                </tr>
                )}
                </tbody>
            </Table>

            <Paginator
                ref={x => this.paginator = x}
                totalResults={this.props.collection.length}
                limitPerPage={this.state.limitPerPage}
                currentPage={this.state.currentPageNum}
                onChangePage={(pageNum) => this.setState({ currentPageNum: pageNum })} />

        </Container>;
    }
}

export default withRouter(withStore(
    EventsPage,
    state => state.naturalEvent, // Selects which state properties are merged into the component's props.
    naturalEventsStore.actionCreators, // Selects which action creators are merged into the component's props.
));
