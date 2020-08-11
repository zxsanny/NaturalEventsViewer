import * as naturalEventStore from "@Store/naturalEventStore";
import { connect } from "react-redux";

// The top-level state object.
export interface ApplicationState {
    naturalEvent: naturalEventStore.NaturalEventsStoreState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    naturalEvent: naturalEventStore.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}

export interface AppThunkActionAsync<TAction, TResult> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState) : Promise<TResult>
}

export function withStore<TStoreState, TActionCreators, TComponent extends React.ComponentType<TStoreState & TActionCreators & any>>(
    component: TComponent,
    stateSelector: (state: ApplicationState) => TStoreState,
    actionCreators: TActionCreators
): TComponent {
    return connect(stateSelector, actionCreators)(component) as unknown as TComponent;
}
