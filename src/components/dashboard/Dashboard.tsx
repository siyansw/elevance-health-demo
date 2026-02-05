import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ShieldCheck, Clock, Sparkles, LogOut, Play, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ExecutionModal } from '../modals/ExecutionModal';
import { ResultsDetail } from './ResultsDetail';
import type { UseCaseConfig, ExecutionResult } from '../../lib/types';
import { storage } from '../../lib/storage';

interface DashboardProps {
  onLogout: () => void;
}

const useCases: UseCaseConfig[] = [
  {
    id: 'pt-committee',
    title: 'P&T Committee Intelligence',
    description: 'Automate evidence gathering for formulary decisions. Query FDA databases, ClinicalTrials.gov, and PubMed to compile comprehensive clinical evidence for drug reviews.',
    icon: 'FileText',
    estimatedTime: '45-55 seconds',
    category: 'Clinical Evidence',
    gradient: 'from-blue-50 to-indigo-50',
  },
  {
    id: 'prior-auth',
    title: 'Prior Authorization Intelligence',
    description: 'Research clinical criteria across CMS LCD/NCD, medical society guidelines, and competitor policies. Streamline PA requirements with evidence-based insights.',
    icon: 'ShieldCheck',
    estimatedTime: '40-60 seconds',
    category: 'Authorization',
    gradient: 'from-cyan-50 to-sky-50',
  },
];

const iconMap = {
  FileText: FileText,
  ShieldCheck: ShieldCheck,
};

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, ExecutionResult>>({});
  const [executingUseCase, setExecutingUseCase] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Load previous results on mount
  useEffect(() => {
    const storedResults = storage.getAllResults();
    const resultsMap: Record<string, ExecutionResult> = {};
    Object.entries(storedResults).forEach(([id, stored]) => {
      resultsMap[id] = stored.result;
    });
    setResults(resultsMap);
  }, []);

  const handleExecuteUseCase = async (useCaseId: string) => {
    setExecutingUseCase(useCaseId);
  };

  const handleExecutionComplete = (useCaseId: string, result: ExecutionResult) => {
    // Save result to storage
    storage.saveResult(useCaseId, result);

    // Update local state
    setResults(prev => ({
      ...prev,
      [useCaseId]: result,
    }));

    setExecutingUseCase(null);
  };

  const handleExecutionClose = () => {
    setExecutingUseCase(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-elevance-blue to-elevance-lightblue rounded-lg flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-elevance-blue">Elevance Health</h1>
                <p className="text-xs text-gray-600">Clinical Intelligence Platform</p>
              </div>
            </motion.div>

            <Button variant="ghost" size="sm" onClick={onLogout} icon={<LogOut className="w-4 h-4" />}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Web Automation using AI Agents
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Accelerate clinical decisions with intelligent automation. Click Run to execute AI agents in real-time.
          </p>
        </motion.div>

        {/* Use Case Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {useCases.map((useCase, index) => {
            const Icon = iconMap[useCase.icon as keyof typeof iconMap];
            const isHovered = hoveredCard === useCase.id;
            const result = results[useCase.id];
            const hasRun = !!result;

            return (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(useCase.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card hover={false} className="h-full">
                  <div className={`p-8 bg-gradient-to-br ${useCase.gradient} h-full flex flex-col`}>
                    {/* Icon & Category */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md"
                      >
                        <Icon className="w-7 h-7 text-elevance-blue" />
                      </motion.div>
                      <span className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-medium text-elevance-blue">
                        {useCase.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        {useCase.description}
                      </p>

                      {/* Results Display */}
                      {hasRun && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-4"
                        >
                          <div className="flex items-center mb-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm font-semibold text-gray-900">Last Run Results</span>
                          </div>
                          <p className="text-xs text-gray-700 mb-3">{result.summary}</p>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-white/60 rounded px-2 py-1.5">
                              <div className="text-gray-600">Duration</div>
                              <div className="font-semibold text-elevance-blue">{(result.duration / 1000).toFixed(1)}s</div>
                            </div>
                            <div className="bg-white/60 rounded px-2 py-1.5">
                              <div className="text-gray-600">Sources</div>
                              <div className="font-semibold text-elevance-blue">{result.details?.sourcesQueried || 'N/A'}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/50">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="w-4 h-4 mr-1.5" />
                          <span>{useCase.estimatedTime}</span>
                        </div>
                        {hasRun && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedCard(expandedCard === useCase.id ? null : useCase.id)}
                            icon={expandedCard === useCase.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          >
                            {expandedCard === useCase.id ? 'Hide Details' : 'View Details'}
                          </Button>
                        )}
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleExecuteUseCase(useCase.id)}
                        icon={<Play className="w-4 h-4" />}
                      >
                        {hasRun ? 'Run Again' : 'Run'}
                      </Button>
                    </div>

                    {/* Detailed Results */}
                    <AnimatePresence>
                      {hasRun && expandedCard === useCase.id && (
                        <ResultsDetail result={result} useCaseId={useCase.id} />
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-elevance-lightblue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-elevance-blue" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-Time Execution</h4>
              <p className="text-sm text-gray-600">Watch AI agents work in real-time with live streaming logs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-elevance-lightblue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6 text-elevance-blue" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Evidence-Based</h4>
              <p className="text-sm text-gray-600">Aggregates data from trusted medical and regulatory sources</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-elevance-lightblue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-elevance-blue" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600">Complete complex research tasks in under 60 seconds</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500">
        <p>Powered by TinyFish AI Agent Orchestration</p>
      </footer>

      {/* Execution Modal */}
      {executingUseCase && (
        <ExecutionModal
          isOpen={true}
          onClose={handleExecutionClose}
          useCaseId={executingUseCase}
          useCaseTitle={useCases.find(uc => uc.id === executingUseCase)?.title || ''}
          onComplete={(result) => handleExecutionComplete(executingUseCase, result)}
        />
      )}
    </div>
  );
};
