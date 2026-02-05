import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, DollarSign, Users, Award, CheckCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ExecutionResult } from '../../lib/types';
import { Card } from '../common/Card';

interface ResultsDetailProps {
  result: ExecutionResult;
  useCaseId: string;
}

export const ResultsDetail: React.FC<ResultsDetailProps> = ({ result, useCaseId }) => {
  const { details } = result;

  if (!details.drugProfile) return null;

  const isPTCommittee = useCaseId === 'pt-committee';

  // Prepare chart data
  const comparatorChartData = details.comparatorDrugs?.map((drug) => ({
    name: drug.name.split(' ')[0], // Shorten names
    Efficacy: drug.efficacy,
    'Cost ($K)': (drug.cost / 1000).toFixed(1),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6 space-y-4"
    >
      {/* Drug Profile Summary */}
      <Card>
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{details.drugProfile.name}</h3>
              <p className="text-sm text-gray-600">{details.drugProfile.manufacturer}</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              FDA Approved
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center text-gray-600 text-xs mb-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Efficacy Rate
              </div>
              <div className="text-2xl font-bold text-elevance-blue">
                {details.drugProfile.efficacyRate}%
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center text-gray-600 text-xs mb-1">
                <DollarSign className="w-3 h-3 mr-1" />
                Annual Cost
              </div>
              <div className="text-2xl font-bold text-elevance-blue">
                ${(details.drugProfile.costPerYear / 1000).toFixed(1)}K
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center text-gray-600 text-xs mb-1">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Adverse Events
              </div>
              <div className="text-2xl font-bold text-gray-700">
                {details.drugProfile.adverseEvents}%
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center text-gray-600 text-xs mb-1">
                <Calendar className="w-3 h-3 mr-1" />
                FDA Approval
              </div>
              <div className="text-sm font-semibold text-gray-700">
                {details.drugProfile.fdaApprovalDate}
              </div>
            </div>
          </div>

          {/* Indications */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">FDA-Approved Indications</h4>
            <div className="flex flex-wrap gap-2">
              {details.drugProfile.indications.map((indication, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/80 text-elevance-blue rounded-full text-xs font-medium"
                >
                  {indication}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Clinical Trials - PT Committee only */}
      {isPTCommittee && details.clinicalTrials && details.clinicalTrials.length > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-elevance-blue mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Key Clinical Trials</h3>
            </div>
            <div className="space-y-3">
              {details.clinicalTrials.map((trial, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{trial.id}</h4>
                      <p className="text-xs text-gray-600">
                        {trial.phase} • {trial.participants.toLocaleString()} participants
                      </p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Outcome:</strong> {trial.primaryOutcome}
                  </p>
                  <p className="text-sm text-elevance-blue font-medium">{trial.result}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* PA Criteria - Prior Auth only */}
      {!isPTCommittee && details.paCriteria && details.paCriteria.length > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-5 h-5 text-elevance-blue mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Prior Authorization Criteria</h3>
            </div>
            <div className="space-y-2">
              {details.paCriteria.map((criteria, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  {criteria.required ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{criteria.criteriaType}</h4>
                    <p className="text-xs text-gray-600">{criteria.description}</p>
                  </div>
                  {criteria.required && (
                    <span className="text-xs font-medium text-red-600">Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Clinical Guidelines */}
      {details.guidelines && details.guidelines.length > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Award className="w-5 h-5 text-elevance-blue mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Clinical Guidelines & Recommendations</h3>
            </div>
            <div className="space-y-3">
              {details.guidelines.map((guideline, idx) => (
                <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{guideline.organization}</h4>
                    <span className="px-2 py-1 bg-elevance-blue text-white rounded text-xs font-medium">
                      {guideline.evidenceLevel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{guideline.recommendation}</p>
                  <p className="text-xs text-gray-600">Published: {guideline.yearPublished}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Comparator Drugs Chart */}
      {details.comparatorDrugs && details.comparatorDrugs.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Comparator Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparatorChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#1A3673" />
                  <YAxis yAxisId="right" orientation="right" stroke="#44b8f3" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="Efficacy" fill="#1A3673" />
                  <Bar yAxisId="right" dataKey="Cost ($K)" fill="#44b8f3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};
