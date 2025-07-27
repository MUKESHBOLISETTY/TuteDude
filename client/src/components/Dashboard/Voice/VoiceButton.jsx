import React from 'react';
import { motion } from 'framer-motion';
import { MicrophoneIcon } from '@heroicons/react/24/solid';
// Assuming useVoiceSearch hook is defined elsewhere in plain JS or compatible.
// For demonstration, a placeholder hook is provided if the actual implementation isn't available.

// Placeholder for useVoiceSearch hook if not provided
const useVoiceSearch = () => {
  const startVoiceSearch = () => {
    console.log("Voice search initiated (placeholder function)");
    // Implement actual voice search logic here
    // e.g., using Web Speech API or a third-party library
    alert("Voice search is not fully implemented in this demo.");
  };
  return { startVoiceSearch };
};


const VoiceButton = () => {
  const { startVoiceSearch } = useVoiceSearch();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={startVoiceSearch}
      className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 lg:bottom-8 lg:right-8"
      aria-label="Start voice search"
    >
      <MicrophoneIcon className="w-6 h-6" />
    </motion.button>
  );
};

export default VoiceButton;
