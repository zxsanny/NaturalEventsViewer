import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { NaturalEvent, NaturalEventsOrder, OrderDirection } from '@Models/NaturalEvent';
import NaturalEventsService from '@Services/naturalEventsService';

// Declare an interface of the store's state.
export interface NaturalEventsStoreState {
    isFetching: boolean;
    collection: NaturalEvent[];
}

// Create the slice.
const slice = createSlice({
    name: "naturalEvent",
    initialState: {
        isFetching: false,
        collection: []
    } as NaturalEventsStoreState,
    reducers: {
        setFetching: (state, action: PayloadAction<boolean>) => {
            state.isFetching = action.payload;
        },
        setData: (state, action: PayloadAction<NaturalEvent[]>) => {
            state.collection = action.payload;
        }
    }
});

// Export reducer from the slice.
export const { reducer } = slice;

// Define action creators.
export const actionCreators = {
    search: (orderBy: NaturalEventsOrder = null, orderDirection: OrderDirection = null, date: Date = null, isOpen: boolean = null, category: string = null) => async (dispatch: Dispatch) => {
        dispatch(slice.actions.setFetching(true));

        const service = new NaturalEventsService();
        const result = await service.search(orderBy, orderDirection, date, isOpen, category);

        if (!result.error) {
            dispatch(slice.actions.setData(result.value));
        }

        dispatch(slice.actions.setFetching(false));

        return result;
    }
};
