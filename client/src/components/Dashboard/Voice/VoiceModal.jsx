import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { useVoiceSearch } from '../../../hooks/useVoiceSearch';


const VoiceModal = () => {
  const { isModalOpen, isListening, transcript, error, isProcessing } = useSelector((state) => state.voice);
  const { startVoiceSearch, stopVoiceSearch, closeVoiceModal } = useVoiceSearch();

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
              ) : isProcessing ? (
                <div>
                  <h3 className="text-lg font-medium text-blue-600 mb-2">Processing...</h3>
                  <p className="text-gray-600">Analyzing your request with AI</p>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="flex justify-center mt-3"
                  >
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </motion.div>
                </div>
              ) : transcript ? (
                <div>
                  <h3 className="text-lg font-medium text-green-600 mb-2">Search Complete!</h3>
                  <p className="text-gray-700 whitespace-pre-line">"{transcript}"</p>
                </div>
              ) : error ? (
                <div>
                  <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
                  <p className="text-gray-700 mb-3">{error}</p>
                  {error.includes('Microphone access denied') && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                      <p className="text-yellow-800 font-medium mb-1">How to enable microphone:</p>
                      <ul className="text-yellow-700 text-xs space-y-1">
                        <li>• Click the microphone icon in your browser's address bar</li>
                        <li>• Select "Allow" for microphone access</li>
                        <li>• Refresh the page and try again</li>
                      </ul>
                    </div>
                  )}
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
              ) : !transcript && !error && !isProcessing ? (
                <button
                  onClick={startVoiceSearch}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Start
                </button>
              ) : error && error.includes('Microphone access denied') ? (
                <button
                  onClick={startVoiceSearch}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              ) : null}
              <button
                onClick={closeVoiceModal}
                disabled={isProcessing}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isProcessing 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {transcript || error ? 'Close' : 'Cancel'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceModal;
