import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2, Terminal } from 'lucide-react';
import { Button } from '../common/Button';
import type { AgentLog, ExecutionResult } from '../../lib/types';
import { minoClient } from '../../lib/api';

interface ExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  useCaseId: string;
  useCaseTitle: string;
  onComplete: (useCaseId: string, result: ExecutionResult) => void;
}

export const ExecutionModal: React.FC<ExecutionModalProps> = ({
  isOpen,
  onClose,
  useCaseId,
  useCaseTitle,
  onComplete,
}) => {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'running' | 'completed' | 'error'>('running');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔵 ExecutionModal useEffect triggered:', { isOpen, useCaseId });

    if (!isOpen) {
      console.log('❌ Modal not open, resetting state');
      setLogs([]);
      setProgress(0);
      setStatus('running');
      setDuration(0);
      setError(null);
      return;
    }

    console.log('✅ Modal is open, starting execution for:', useCaseId);
    let isCancelled = false;
    const startTime = Date.now();

    // Update duration timer
    const durationTimer = setInterval(() => {
      if (!isCancelled) {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    // Execute the use case
    const execute = async () => {
      console.log('🚀 Starting minoClient.executeUseCase for:', useCaseId);
      try {
        const result = await minoClient.executeUseCase(
          useCaseId,
          (log) => {
            console.log('📝 Log received:', log);
            if (!isCancelled) {
              setLogs((prev) => [...prev, log]);
            }
          },
          (progressValue) => {
            console.log('📊 Progress:', progressValue);
            if (!isCancelled) {
              setProgress(progressValue);
            }
          }
        );

        console.log('✅ Execution completed, result:', result);

        if (!isCancelled) {
          setStatus('completed');
          setProgress(100);
          onComplete(useCaseId, result);
        }
      } catch (err) {
        console.error('❌ Execution error:', err);
        if (!isCancelled) {
          setStatus('error');
          setError(err instanceof Error ? err.message : 'Execution failed');
        }
      }
    };

    console.log('🎬 Calling execute()...');
    execute();

    return () => {
      isCancelled = true;
      clearInterval(durationTimer);
    };
  }, [isOpen, useCaseId, onComplete]);

  const handleClose = () => {
    // Allow closing modal even during execution - it will continue in background
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-elevance-blue to-elevance-lightblue rounded-lg flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{useCaseTitle}</h2>
                <p className="text-sm text-gray-600">
                  {status === 'running' ? `Running - ${duration}s elapsed` : status === 'completed' ? `Completed in ${duration}s` : 'Error'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              icon={<X className="w-4 h-4" />}
            >
              {status === 'running' ? 'Minimize' : 'Close'}
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Execution Progress</span>
              <span className="text-sm font-medium text-elevance-blue">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-elevance-blue to-elevance-lightblue"
              />
            </div>
          </div>

          {/* Logs */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Execution Failed</h3>
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      {log.level === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      )}
                      {log.level === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      {log.level === 'info' && (
                        <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                      )}
                      {log.level === 'warning' && (
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-mono text-gray-500">{log.timestamp}</span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded ${
                              log.level === 'success'
                                ? 'bg-green-100 text-green-700'
                                : log.level === 'error'
                                ? 'bg-red-100 text-red-700'
                                : log.level === 'warning'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {log.level.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{log.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {logs.length === 0 && status === 'running' && (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-elevance-blue animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Initializing AI agents...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {status === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border-t border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Execution Completed</h3>
                    <p className="text-sm text-gray-600">Report generated in {duration} seconds</p>
                  </div>
                </div>
                <Button variant="primary" size="sm" onClick={handleClose}>
                  Done
                </Button>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border-t border-gray-200 bg-red-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Execution Failed</h3>
                    <p className="text-sm text-gray-600">Please try again or contact support</p>
                  </div>
                </div>
                <Button variant="primary" size="sm" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
