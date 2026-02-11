import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Clock, Sparkles, LogOut, Play, CheckCircle2, Eye } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ExecutionModal } from '../modals/ExecutionModal';
import { ResultsDetail } from './ResultsDetail';
import type { UseCaseConfig, ExecutionResult } from '../../lib/types';
import { storage } from '../../lib/storage';
import { PT_COMMITTEE_DEMO_DATA, PRIOR_AUTH_DEMO_DATA } from '../../lib/demoData';

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
  const [selectedUseCase, setSelectedUseCase] = useState<string>('pt-committee'); // Show one use case at a time
  const [showLiveModal, setShowLiveModal] = useState(false);

  // Always load demo data on mount for the demo
  useEffect(() => {
    // Always start with demo data to ensure something is visible
    const resultsMap: Record<string, ExecutionResult> = {
      'pt-committee': PT_COMMITTEE_DEMO_DATA,
      'prior-auth': PRIOR_AUTH_DEMO_DATA,
    };

    setResults(resultsMap);
    console.log('✅ Demo data loaded:', resultsMap);
  }, []);

  const handleExecuteUseCase = async (useCaseId: string) => {
    console.log('🎯 Dashboard: Execute button clicked for:', useCaseId);
    // Start execution and open modal
    setExecutingUseCase(useCaseId);
    setShowLiveModal(true); // Open modal to start execution
    console.log('📂 Dashboard: Starting execution');
  };

  const handleExecutionComplete = useCallback((useCaseId: string, result: ExecutionResult) => {
    console.log('✅ Execution completed callback:', useCaseId);
    // Save result to storage
    storage.saveResult(useCaseId, result);

    // Update local state
    setResults(prev => ({
      ...prev,
      [useCaseId]: result,
    }));

    // Stop execution state
    setExecutingUseCase(null);
  }, []);

  const handleExecutionClose = () => {
    setShowLiveModal(false);
  };

  const handleWatchLive = () => {
    setShowLiveModal(true);
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
              <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-lightblue rounded-lg flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-blue">Clinical Intelligence</h1>
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
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Clinical Intelligence Reports
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Comprehensive formulary and prior authorization analysis powered by AI agents.
            <span className="font-semibold text-brand-blue"> All data ready to view below.</span>
          </p>

          {/* Use Case Selector */}
          <div className="flex justify-center gap-4 mb-8">
            {useCases.map((useCase) => {
              const Icon = iconMap[useCase.icon as keyof typeof iconMap];
              const isSelected = selectedUseCase === useCase.id;
              return (
                <button
                  key={useCase.id}
                  onClick={() => setSelectedUseCase(useCase.id)}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-brand-blue text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-bold text-lg">{useCase.title}</div>
                    <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                      {useCase.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Use Case - Full Screen */}
        <div className="max-w-7xl mx-auto">
          {useCases.filter(uc => uc.id === selectedUseCase).map((useCase, index) => {
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
                        <Icon className="w-7 h-7 text-brand-blue" />
                      </motion.div>
                      <span className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-medium text-brand-blue">
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
                          className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 mb-4"
                        >
                          <div className="flex items-center mb-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-base font-bold text-gray-900">Comprehensive Analysis Ready</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{result.summary}</p>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-white/80 rounded px-3 py-2">
                              <div className="text-gray-600">Data Points</div>
                              <div className="font-bold text-brand-blue text-lg">{result.details?.dataPointsAnalyzed?.toLocaleString() || 'N/A'}</div>
                            </div>
                            <div className="bg-white/80 rounded px-3 py-2">
                              <div className="text-gray-600">Sources Analyzed</div>
                              <div className="font-bold text-brand-blue text-lg">{result.details?.sourcesQueried || 'N/A'}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Run Agent Button */}
                    <div className="pt-6 border-t border-white/50">
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => handleExecuteUseCase(useCase.id)}
                          icon={<Play className="w-5 h-5" />}
                          disabled={executingUseCase === useCase.id}
                          className="px-8 shadow-lg"
                        >
                          {executingUseCase === useCase.id ? 'Running Agent...' : 'Run Live Agent'}
                        </Button>
                        {executingUseCase === useCase.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleWatchLive}
                            icon={<Eye className="w-4 h-4" />}
                          >
                            Watch Live
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Detailed Results - Always Visible */}
                    {hasRun && (
                      <ResultsDetail result={result} useCaseId={useCase.id} />
                    )}
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
              <div className="w-12 h-12 bg-brand-lightblue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-brand-blue" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-Time Execution</h4>
              <p className="text-sm text-gray-600">Watch AI agents work in real-time with live streaming logs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-lightblue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6 text-brand-blue" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Evidence-Based</h4>
              <p className="text-sm text-gray-600">Aggregates data from trusted medical and regulatory sources</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-lightblue/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-brand-blue" />
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

      {/* Execution Modal - Only shown when "Watch Live" is clicked */}
      {executingUseCase && showLiveModal && (
        <ExecutionModal
          isOpen={true}
          onClose={handleExecutionClose}
          useCaseId={executingUseCase}
          useCaseTitle={useCases.find(uc => uc.id === executingUseCase)?.title || ''}
          onComplete={handleExecutionComplete}
        />
      )}
    </div>
  );
};
