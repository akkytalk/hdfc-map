import { createSlice } from "@reduxjs/toolkit";

const bankSlice = createSlice({
  name: "Bank",
  initialState: {
    bank: [],
    error: false,
    isLoading: false,
  },
  reducers: {
    setBank: (state, action) => {
      state.bank = action.payload;
      state.isLoading = false;
      state.error = false;
    },
    getBankError: (state, action) => {
      state.error = true;
      state.isLoading = false;
    },
    getBankLoading: (state, action) => {
      state.isLoading = true;
      state.error = false;
    },
    bankCheckedStatusUpdate: (state, action) => {
      state.bank = state.bank.map((bank) => {
        if (bank.place_id === action.payload.place_id) {
          bank.checked = action.payload.checked;
        }
        return bank;
      });
    },
    // remove bank all data after reloading the page
    removeBankData: (state, action) => {
      state.bank = [];
    },
  },
});

export const {
  setBank,
  getBankError,
  getBankLoading,
  bankCheckedStatusUpdate,
  removeBankData,
} = bankSlice.actions;

export default bankSlice.reducer;
