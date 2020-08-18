import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import NaturalEventsService from '@Services/naturalEventsService';
import { NaturalEvent, NaturalEventFilters } from '@Models/NaturalEvent';

// Declare an interface of the store's state.
export interface NaturalEventsStoreState {
    isFetching: boolean;
    collection: NaturalEvent[];
    event: NaturalEvent;
}

// Create the slice.
const slice = createSlice({
    name: "naturalEvents",
    initialState: {
        isFetching: false,
        collection: [],
        event: null,
    } as NaturalEventsStoreState,
    reducers: {
        setFetching: (state, action: PayloadAction<boolean>) => {
            state.isFetching = action.payload;
        },
        setData: (state, action: PayloadAction<NaturalEvent[]>) => {
            state.collection = action.payload;
        },
        //setEvent: (state, action: PayloadAction<NaturalEvent>) => {
        //    state.event = action.payload;
        //}
    }
});

// Export reducer from the slice.
export const { reducer } = slice;

// Define action creators.
export const actionCreators = {
    search: (filter: NaturalEventFilters = null) => async (dispatch: Dispatch) => {
        dispatch(slice.actions.setFetching(true));

        const result = await new NaturalEventsService().search(filter);

        if (!result.error) {
            dispatch(slice.actions.setData(result.value));
        }

        dispatch(slice.actions.setFetching(false));

        return result;
    }

    //openEvent: (id: string) => async (dispatch: Dispatch) => {
    //    dispatch(slice.actions.setFetching(true));

    //    const result = await new NaturalEventsService.getEvent(id);
    //    if (!result.error) {
    //        dispatch(slice.actions.setEvent(result.value));
    //    }

    //    dispatch(slice.actions.setFetching(false));
    //    return result;
    //}
};
