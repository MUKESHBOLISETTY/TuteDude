import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
// RootState import is removed as it's TypeScript specific

// Placeholder for useVoiceSearch hook if not provided
// In a real application, you would import your actual hook.
const useVoiceSearch = () => {
  // These functions would typically interact with Web Speech API or a similar service
  const startVoiceSearch = () => console.log("Starting voice search...");
  const stopVoiceSearch = () => console.log("Stopping voice search...");
  const closeVoiceModal = () => console.log("Closing voice modal...");
  return { startVoiceSearch, stopVoiceSearch, closeVoiceModal };
};


const VoiceModal = () => {
  // Type annotation for useSelector state is removed for JSX conversion
  const { isModalOpen, isListening, transcript, error } = useSelector((state) => state.voice);
  const { stopVoiceSearch, closeVoiceModal } = useVoiceSearch();

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-search-title"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={closeVoiceModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close voice search"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 id="voice-search-title" className="text-xl font-semibold mb-6">
              Voice Search
            </h2>

            {/* Microphone Animation */}
            <div className="mb-6">
              <motion.div
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
                  isListening 
                    ? 'bg-green-100 border-4 border-green-300' 
                    : 'bg-gray-100 border-4 border-gray-300'
                }`}
              >
                <motion.div
                  animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: isListening ? Infinity : 0, duration: 0.8 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isListening ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                >
                  <MicrophoneIcon className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>
            </div>

            {/* Status */}
            <div className="mb-6" aria-live="polite">
              {isListening ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Listening...</h3>
                  <p className="text-gray-600">Speak clearly into your microphone</p>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex justify-center mt-3"
                  >
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scaleY: [1, 2, 1] }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1,
                            delay: i * 0.2 
                          }}
                          className="w-1 h-4 bg-green-500 rounded"
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : transcript ? (
                <div>
                  <h3 className="text-lg font-medium text-green-600 mb-2">Search Complete!</h3>
                  <p className="text-gray-700">"{transcript}"</p>
                </div>
              ) : error ? (
                <div>
                  <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
                  <p className="text-gray-700">{error}</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready</h3>
                  <p className="text-gray-600">Click Start to begin voice search</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {isListening ? (
                <button
                  onClick={stopVoiceSearch}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Stop
                </button>
              ) : null}
              <button
                onClick={closeVoiceModal}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceModal;
