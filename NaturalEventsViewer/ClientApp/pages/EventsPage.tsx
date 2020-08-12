import "@Styles/main.scss";
import * as React from "react";
import { Helmet } from "react-helmet";
import { RouteComponentProps, withRouter } from "react-router";
import * as naturalEventsStore from "@Store/naturalEventStore";
import { withStore } from "@Store/index";
import Paginator from "@Components/shared/Paginator";
import { paginate } from "@Utils";
import { Container } from "react-bootstrap";
import { NaturalEventsOrder, OrderDirection } from "../models/NaturalEvent";
import DatePicker from "react-datepicker";

type Props = typeof naturalEventsStore.actionCreators & naturalEventsStore.NaturalEventsStoreState & RouteComponentProps<{}>;

interface State {
    orderBy?: NaturalEventsOrder;
    orderDirection?: OrderDirection;
    date?: Date;
    isOpen?: boolean;
    category?: string;
    currentPageNum: number;
    limitPerPage: number;
}

class EventsPage extends React.Component<Props, State> {

    private paginator: Paginator;

    constructor(props: Props) {
        super(props);

        this.state = {
            orderBy: NaturalEventsOrder.Date,
            orderDirection: OrderDirection.ASC,
            date: null,
            isOpen: null,
            category: null,
            currentPageNum: 1,
            limitPerPage: 20,
        };

        this.props.search();
    }

    private onChangeSearch = () => {
        this.props.search(this.state.orderBy, this.state.orderDirection, this.state.date, this.state.isOpen, this.state.category);
        this.paginator.setFirstPage();
    }

    render() {
        return <Container>
            <Helmet>
                <title>Earth Observatory Natural Events Tracker Viewer</title>
            </Helmet>

            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>
                            <div>Categories</div>
                            <div>
                                <input type="text" className="filter"
                                    onChange={(input) => { this.setState({ category: input.target.value }, this.onChangeSearch) }
                                } />
                            </div>
                        </th>
                        <th>Sources</th>
                        <th>
                            <div>Coordinates</div>
                            <div>
                                <DatePicker
                                    selected={ this.state.date }
                                    onChange={(input) => this.setState({ date: input }, this.onChangeSearch)}
                                />
                            </div>
                        </th>
                        <th>
                            Closed date
                        </th>
                    </tr>
                </thead>
                <tbody> {
                    paginate(this.props.collection, this.state.currentPageNum, this.state.limitPerPage)
                            .map(event =>
                                <tr className={event.closed ? "disabled" : ""} key={event.id}>
                                    <td><a href={event.link}>{event.title}</a></td>
                                    <td>{event.description}</td>
                                    <td>{event.categories.map(c => c.title).join(', ')}</td>
                                    <td>{event.sources.map(s => <a key={s.id} className="source-event" href={s.url}>{s.id}</a>)}</td>
                                    <td>{event.geometries.map(c =>
                                        <div key={c.coordinates.toString()}>
                                            {c.coordinates}
                                            {c.date}
                                        </div>
                                    )}
                                    </td>
                                    <td>{!event.closed ? 'Open now' : event.closed}</td>
                                </tr>
                )}
                </tbody>
            </table>

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
