import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2, Terminal, TrendingUp } from 'lucide-react';
import { Button } from '../common/Button';
import type { AgentLog } from '../../lib/types';

interface ExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  useCaseTitle: string;
  mode: 'demo' | 'live';
}

export const ExecutionModal: React.FC<ExecutionModalProps> = ({
  isOpen,
  onClose,
  useCaseTitle,
  mode,
}) => {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'running' | 'completed' | 'error'>('running');
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setLogs([]);
      setProgress(0);
      setStatus('running');
      setDuration(0);
      return;
    }

    // Simulate execution (replace with real API call)
    const startTime = Date.now();
    const durationTimer = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Simulated logs for demo
    const demoLogs: AgentLog[] = [
      { timestamp: '0.5s', level: 'info', message: 'Initializing TinyFish agent orchestration...' },
      { timestamp: '1.2s', level: 'info', message: 'Connecting to data sources...' },
      { timestamp: '2.1s', level: 'success', message: 'Connected to FDA Drugs@FDA database' },
      { timestamp: '3.5s', level: 'info', message: 'Querying clinical trial data...' },
      { timestamp: '5.8s', level: 'success', message: 'Retrieved 247 clinical trials from ClinicalTrials.gov' },
      { timestamp: '8.2s', level: 'info', message: 'Searching PubMed for published research...' },
      { timestamp: '11.4s', level: 'success', message: 'Found 1,832 relevant publications' },
      { timestamp: '14.6s', level: 'info', message: 'Analyzing clinical guidelines...' },
      { timestamp: '18.3s', level: 'success', message: 'Compiled recommendations from ADA, ACC, AHA' },
      { timestamp: '21.7s', level: 'info', message: 'Synthesizing evidence and generating report...' },
      { timestamp: '25.1s', level: 'success', message: 'Analysis complete. Processing results...' },
      { timestamp: '28.5s', level: 'success', message: 'Report generated successfully' },
    ];

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < demoLogs.length) {
        setLogs((prev) => [...prev, demoLogs[currentLog]]);
        setProgress(((currentLog + 1) / demoLogs.length) * 100);
        currentLog++;
      } else {
        clearInterval(logInterval);
        setStatus('completed');
      }
    }, 2500);

    return () => {
      clearInterval(logInterval);
      clearInterval(durationTimer);
    };
  }, [isOpen]);

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
                  {mode === 'demo' ? 'Demo Mode' : 'Live Execution'} - {duration}s elapsed
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={status === 'running'}
              icon={<X className="w-4 h-4" />}
            >
              {status === 'running' ? 'Running...' : 'Close'}
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
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          log.level === 'success' ? 'bg-green-100 text-green-700' :
                          log.level === 'error' ? 'bg-red-100 text-red-700' :
                          log.level === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{log.message}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
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
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" icon={<TrendingUp className="w-4 h-4" />}>
                    View Results
                  </Button>
                  <Button variant="primary" size="sm" onClick={onClose}>
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
