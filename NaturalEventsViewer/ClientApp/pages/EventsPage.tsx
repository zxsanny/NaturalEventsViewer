import "@Styles/main.scss";
import * as React from "react";
import { Helmet } from "react-helmet";
import { RouteComponentProps, withRouter } from "react-router";
import * as naturalEventsStore from "@Store/naturalEventStore";
import { withStore } from "@Store/index";
import Paginator from "@Components/shared/Paginator";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { paginate } from "@Utils";
import { Container, Row, Card } from "react-bootstrap";
import { wait } from "domain-wait";

type Props = typeof naturalEventsStore.actionCreators & naturalEventsStore.NaturalEventsStoreState & RouteComponentProps<{}>;

interface State {
    searchTerm: string;
    currentPageNum: number;
    limitPerPage: number;
}

class EventsPage extends React.Component<Props, State> {

    private paginator: Paginator;

    private debouncedSearch: (term: string) => void;

    constructor(props: Props) {
        super(props);

        this.state = {
            searchTerm: "",
            currentPageNum: 1,
            limitPerPage: 5,
        };

        this.debouncedSearch = AwesomeDebouncePromise((term: string) => {
            props.search(term);
        }, 500);

        wait(async () => {
            await this.props.search();
        }, "examplesPageTask");        
    }

    private onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.debouncedSearch(e.currentTarget.value);
        this.paginator.setFirstPage();
    }

    render() {

        return <Container>
            <Helmet>
                <title>Earth Observatory Natural Events Tracker Viewer</title>
            </Helmet>

            <Card body className="mt-4 mb-4">
                <Row>
                    <div className="col-9 col-sm-10 col-md-10 col-lg-11">
                        <input
                            type="text"
                            className="form-control"
                            defaultValue={""}
                            onChange={this.onChangeSearchInput}
                            placeholder={"Search for events..."}
                        />
                    </div>
                </Row>
            </Card>

            <table className="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody> {
                    paginate(this.props.collection, this.state.currentPageNum, this.state.limitPerPage)
                            .map(event =>
                                <tr key={event.id}>
                                    <td>{event.title}</td>
                                    <td>{event.description}</td>
                                    <td>{event.link}</td>
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
