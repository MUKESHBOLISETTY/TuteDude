import React from 'react';
import { motion } from 'framer-motion';
import { MicrophoneIcon } from '@heroicons/react/24/solid';
import { useVoiceSearch } from '../../../hooks/useVoiceSearch';

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
