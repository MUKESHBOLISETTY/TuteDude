import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isListening: false,
  isModalOpen: false,
  transcript: '',
  error: null,
  isProcessing: false,
};

const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    startListening: (state) => {
      state.isListening = true;
      state.isModalOpen = true;
      state.error = null;
    },
    stopListening: (state) => {
      state.isListening = false;
    },
    setTranscript: (state, action) => {
      state.transcript = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isListening = false;
      state.isProcessing = false;
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.isListening = false;
      state.transcript = '';
      state.error = null;
      state.isProcessing = false;
    },
  },
});

export const { startListening, stopListening, setTranscript, setError, setProcessing, closeModal } = voiceSlice.actions;
export default voiceSlice.reducer;