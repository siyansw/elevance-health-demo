import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Info, Database, FileCheck, Globe } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface PriorAuthProps {
  onBack: () => void;
  onExecute: (mode: 'demo' | 'live') => void;
}

export const PriorAuth: React.FC<PriorAuthProps> = ({ onBack, onExecute }) => {
  const [selectedMode, setSelectedMode] = useState<'demo' | 'live'>('demo');

  const dataSources = [
    { name: 'CMS LCD/NCD Database', icon: Database, description: 'Medicare coverage determinations' },
    { name: 'Medical Society Guidelines', icon: FileCheck, description: 'AAD, ACC, AHA recommendations' },
    { name: 'FDA Indications', icon: Info, description: 'Approved uses and clinical trials' },
    { name: 'Payer Coverage Policies', icon: Globe, description: 'Public coverage policies' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-sky-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-brand-blue">Prior Authorization Intelligence</h1>
              <p className="text-sm text-gray-600">Automated Clinical Criteria Research</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Use Case Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <div className="p-8 bg-gradient-to-br from-cyan-50 to-sky-50">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <FileCheck className="w-8 h-8 text-brand-blue" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">About This Use Case</h2>
                  <p className="text-gray-700 mb-4">
                    This workflow automates prior authorization criteria research by aggregating clinical guidelines,
                    coverage policies, and evidence across multiple authoritative sources. The AI agent will compile
                    comprehensive PA requirements for a specific drug or procedure, helping medical directors make
                    informed, evidence-based authorization decisions.
                  </p>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Example Drug:</strong> Dupixent (Dupilumab) for Atopic Dermatitis<br />
                      <strong>Estimated Time:</strong> 40-60 seconds<br />
                      <strong>Sources Queried:</strong> CMS, Medical Societies, FDA, Payer Policies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Data Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataSources.map((source, index) => {
              const Icon = source.icon;
              return (
                <motion.div
                  key={source.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  <Card>
                    <div className="p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-brand-lightblue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{source.name}</h4>
                        <p className="text-xs text-gray-600 truncate">{source.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
          <Card>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-brand-blue font-semibold mb-2">Reduce Admin Burden</div>
                  <p className="text-sm text-gray-600">Automate manual policy research, replacing fax-based processes</p>
                </div>
                <div>
                  <div className="text-brand-blue font-semibold mb-2">Evidence-Based Decisions</div>
                  <p className="text-sm text-gray-600">Comprehensive clinical criteria from trusted sources</p>
                </div>
                <div>
                  <div className="text-brand-blue font-semibold mb-2">Faster Approvals</div>
                  <p className="text-sm text-gray-600">Accelerate authorization timelines from hours to seconds</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Execution Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Execution Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              hover
              onClick={() => setSelectedMode('demo')}
              className={`cursor-pointer ${selectedMode === 'demo' ? 'ring-2 ring-brand-blue' : ''}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Demo Mode</h4>
                  <div className={`w-5 h-5 rounded-full border-2 ${selectedMode === 'demo' ? 'border-brand-blue bg-brand-blue' : 'border-gray-300'} flex items-center justify-center`}>
                    {selectedMode === 'demo' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Uses pre-recorded execution with simulated data. Fast and reliable for demonstrations.
                </p>
              </div>
            </Card>

            <Card
              hover
              onClick={() => setSelectedMode('live')}
              className={`cursor-pointer ${selectedMode === 'live' ? 'ring-2 ring-brand-blue' : ''}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Live Mode</h4>
                  <div className={`w-5 h-5 rounded-full border-2 ${selectedMode === 'live' ? 'border-brand-blue bg-brand-blue' : 'border-gray-300'} flex items-center justify-center`}>
                    {selectedMode === 'live' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Makes real API calls to live data sources. Shows actual agent execution in real-time.
                </p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Execute Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => onExecute(selectedMode)}
            icon={<Play className="w-5 h-5" />}
            className="px-12"
          >
            Start Execution
          </Button>
        </motion.div>
      </main>
    </div>
  );
};
