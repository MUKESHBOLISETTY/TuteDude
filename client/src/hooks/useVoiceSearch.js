import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { startListening, stopListening, setTranscript, setError, setProcessing, closeModal } from '../redux/supplier/voiceSearchSlice';
import { setSearchQuery } from '../redux/supplier/userProductSlice';
import { authApi } from '../services/api';

export const useVoiceSearch = () => {
  const dispatch = useDispatch();
  const recognitionRef = useRef(null);

  // Function to check microphone permissions
  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      if (error.name === 'NotAllowedError') {
        dispatch(setError('Microphone access denied. Please allow microphone permissions in your browser settings and try again.'));
      } else if (error.name === 'NotFoundError') {
        dispatch(setError('No microphone found. Please check your microphone connection.'));
      } else {
        dispatch(setError(`Microphone error: ${error.message}`));
      }
      return false;
    }
  }; 

  const cleanupRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.abort(); 
      recognitionRef.current = null;
    }
  }, []); 

  useEffect(() => {
   if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      dispatch(setError('Speech recognition not supported in this browser.'));
      return; 
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // Initialize SpeechRecognition only if it hasn't been already
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Capture a single utterance
      recognitionRef.current.interimResults = true; // Enable live transcript
      recognitionRef.current.lang = 'en-US'; // Set language to US English
    }

    // Create a local variable for the current recognition instance
    // This helps in setting up event handlers reliably
    const currentRecognition = recognitionRef.current; 

    // Event handler for successful speech recognition result
    currentRecognition.onresult = async (event) => {
      // Build the transcript from all results (live display)
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece;
        } else {
          interimTranscript += transcriptPiece;
        }
      }
      // Show live transcript (interim + final)
      dispatch(setTranscript((finalTranscript + interimTranscript).trim()));

      // Only process AI when the last result is final
      if (event.results[event.results.length - 1].isFinal) {
        dispatch(stopListening());
        dispatch(setProcessing(true));
        const transcript = finalTranscript.trim();
        try {
          // Call AI Finder to classify the food item
          const aiResponse = await authApi.aiFinder(transcript);
          const aiResult = aiResponse.data.data;
          // Parse the AI response to extract food item and category
          const lines = aiResult.split('\n');
          let foodItem = null;
          let category = null;
          for (const line of lines) {
            if (line.includes('* Food Item:')) {
              foodItem = line.split('* Food Item:')[1]?.trim();
              if (foodItem === 'null') foodItem = null;
            } else if (line.includes('* Category:')) {
              category = line.split('* Category:')[1]?.trim();
              if (category === 'null') category = null;
            }
          }
          // If AI found a food item, use it for search, otherwise show all products
          if (foodItem && foodItem !== 'null') {
            dispatch(setSearchQuery(foodItem));
            dispatch(setTranscript(`${transcript}\n\nAI detected: ${foodItem} (${category})`));
          } else {
            // No food item found or AI returned null - show all products
            dispatch(setSearchQuery(''));
            dispatch(setTranscript(`${transcript}\n\nNo specific food item detected. Showing all available products.`));
          }
          setTimeout(() => {
            dispatch(setProcessing(false));
            dispatch(closeModal());
          }, 2000);
        } catch (error) {
          console.error('AI Finder error:', error);
          dispatch(setSearchQuery(''));
          dispatch(setTranscript(`${transcript}\n\nAI processing failed. Showing all available products.`));
          dispatch(setProcessing(false));
          setTimeout(() => dispatch(closeModal()), 1000);
        }
      }
    };

    // Event handler for errors during speech recognition
    currentRecognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);

      if (event.error === 'aborted') {
        // Do not show an error to the user, just reset state
        dispatch(stopListening());
        return; // Exit early, don't set error
      }
      
      // Handle different types of errors
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          dispatch(setError('Microphone access denied. Please allow microphone permissions in your browser settings and try again.'));
          break;
        case 'no-speech':
          dispatch(setError('No speech detected. Please try speaking again.'));
          break;
        case 'audio-capture':
          dispatch(setError('No microphone found. Please check your microphone connection.'));
          break;
        case 'network':
          dispatch(setError('Network error: Please check your internet connection and try again. If the problem persists, try refreshing the page or using a different browser.'));
          break;
        case 'service-not-allowed':
          dispatch(setError('Speech recognition service not allowed. Please try again.'));
          break;
        default:
          dispatch(setError(`Voice recognition error: ${event.error}`));
      }
      
      dispatch(stopListening()); // Ensure listening state is reset on error
      // Only close modal for no-speech, if you want. Otherwise, keep it open for all errors.
      // if (event.error === 'no-speech') {
      //   dispatch(closeModal());
      // }
    };

    // Event handler when speech recognition service has disconnected
    currentRecognition.onend = () => {
      console.log('Speech recognition ended');
      dispatch(stopListening()); // Ensure listening state is reset
      // Only close modal if we're not in an error state and no transcript was captured
      // This prevents the modal from closing when user just stops speaking without error
    };

    // Cleanup function for useEffect
    // This runs when the component unmounts or before the effect re-runs
    return () => {
      cleanupRecognition();
    };
  }, [dispatch, cleanupRecognition]); // Dependencies for useEffect

  // Function to start voice search
  const startVoiceSearch = async () => {
    if (recognitionRef.current) {
      // First check microphone permissions
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) {
        dispatch(stopListening());
        return;
      }

      dispatch(startListening()); // Set Redux state to listening
      dispatch(setError(null)); // Clear any previous errors
      dispatch(setTranscript('')); // Clear any previous transcript

      try {
        recognitionRef.current.start(); // Start the speech recognition
      } catch (e) {
        console.error('Failed to start recognition:', e);
        // Catch potential errors if recognition is already active or in a bad state
        dispatch(setError(`Failed to start recognition: ${e.message}`));
        dispatch(stopListening());
        // Don't close modal on start errors - let user try again
      }
    } else {
      dispatch(setError('Speech recognition not supported in this browser.')); // Dispatch error if not supported
    }
  };

  // Function to stop voice search manually
  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // Stop the speech recognition (triggers onend)
    }
    dispatch(stopListening()); // Ensure Redux state is updated immediately
    dispatch(closeModal()); // Close modal immediately on manual stop
  };

  // Function to close the voice search modal
  const closeVoiceModal = () => {
    if (recognitionRef.current) {
      // Use abort to immediately stop recognition without waiting for onend
      recognitionRef.current.abort();
    }
    dispatch(closeModal()); // Close the modal
    dispatch(stopListening()); // Ensure listening state is reset
    dispatch(setTranscript('')); // Clear transcript when modal is closed manually
    dispatch(setError(null)); // Clear errors
    dispatch(setProcessing(false)); // Reset processing state
  };

  // Return the functions to be used by components
  return { startVoiceSearch, stopVoiceSearch, closeVoiceModal };
};
