import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  isListening: false,
  transcript: '',
  error: null,
};

const voiceSearchSlice = createSlice({
  name: 'voiceSearch',
  initialState,
  reducers: {
    openVoiceSearch: (state) => {
      state.isOpen = true;
      state.error = null;
    },
    closeVoiceSearch: (state) => {
      state.isOpen = false;
      state.isListening = false;
      state.transcript = '';
      state.error = null;
    },
    startListening: (state) => {
      state.isListening = true;
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
    },
  },
});

export const {
  openVoiceSearch,
  closeVoiceSearch,
  startListening,
  stopListening,
  setTranscript,
  setError,
} = voiceSearchSlice.actions;

export default voiceSearchSlice.reducer;