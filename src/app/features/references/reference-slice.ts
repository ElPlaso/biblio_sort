import { RootState } from '@/app/store/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReferenceState {
    inputValue: string;
    importValue: string;
    items: any[];
    prepend: boolean;
    copyWithLinks: boolean;
}

const initialState: ReferenceState = {
    inputValue: '',
    importValue: '',
    items: [],
    prepend: false,
    copyWithLinks: false,
};

export const referenceSlice = createSlice({
    name: 'references',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<any[]>) => {
            state.items = action.payload;
        },
        addItem: (state, action: PayloadAction<string>) => {
            if (action.payload.trim() === '') return;
            const newItem = { id: Date.now().toString(), content: action.payload };
            state.items = state.prepend ? [newItem, ...state.items] : [...state.items, newItem];
            state.inputValue = '';
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items.splice(action.payload, 1);
        },
        updateItem: (state, action: PayloadAction<{ index: number, content: string }>) => {
            state.items[action.payload.index].content = action.payload.content;
        },
        setInputValue: (state, action: PayloadAction<string>) => {
            state.inputValue = action.payload;
        },
        setImportValue: (state, action: PayloadAction<string>) => {
            state.importValue = action.payload;
        },
        importItems: (state) => {
            const newItems = state.importValue
                .split("\n\n")
                .filter((content) => content.trim() !== "") // Filter out empty strings
                .map((content) => content.replace(/^\[\d+\]\s/, "")) // Removing numbers
                .map((content, index) => ({
                    id: `${Date.now().toString()}-${index}`,
                    content: content.trim(),
                }));

            state.items = state.prepend ? [...newItems, ...state.items] : [...state.items, ...newItems];
            state.importValue = '';
        },
        togglePrepend: (state) => {
            state.prepend = !state.prepend;
        },
        toggleCopyWithLinks: (state) => {
            state.copyWithLinks = !state.copyWithLinks;
        },
    },
});

export const {
    setItems,
    addItem,
    removeItem,
    updateItem,
    setInputValue,
    setImportValue,
    importItems,
    togglePrepend,
    toggleCopyWithLinks
} = referenceSlice.actions;

export const selectItems = (state: RootState) => state.references.items;
export const selectInputValue = (state: RootState) => state.references.inputValue;
export const selectImportValue = (state: RootState) => state.references.importValue;
export const selectPrepend = (state: RootState) => state.references.prepend;
export const selectCopyWithLinks = (state: RootState) => state.references.copyWithLinks;

export default referenceSlice.reducer;