import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Activity,
  BarChart3,
  FileText,
  Bell,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
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
    name: drug.name.split(' ')[0],
    HbA1c: drug.hba1c || 0,
    'Weight Loss (kg)': drug.weightLoss || 0,
    'MACE Reduction (%)': drug.maceReduction || 0,
    Efficacy: drug.efficacy,
    'Cost ($K)': Number((drug.cost / 1000).toFixed(1)),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6"
    >
      {/* Drug Profile Header Banner */}
      <Card>
        <div className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{details.drugProfile.genericName}</h3>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {details.drugProfile.brandNames?.map((brand, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-elevance-blue text-white rounded-full text-sm font-medium"
                  >
                    {brand}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <span className="flex items-center">
                  <strong className="mr-1">Manufacturer:</strong> {details.drugProfile.manufacturer}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  FDA Approved: {details.drugProfile.fdaApprovalDate}
                </span>
                {details.drugProfile.drugClass && (
                  <span className="px-2 py-1 bg-white/60 rounded text-xs font-medium">
                    {details.drugProfile.drugClass}
                  </span>
                )}
                {details.drugProfile.dosingSchedule && (
                  <span className="px-2 py-1 bg-white/60 rounded text-xs font-medium">
                    {details.drugProfile.dosingSchedule}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            {isPTCommittee && details.drugProfile.hba1cReduction && (
              <div className="grid grid-cols-3 gap-4 ml-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-1">HbA1c Reduction</div>
                  <div className="text-2xl font-bold text-elevance-blue">-{details.drugProfile.hba1cReduction}%</div>
                  {details.drugProfile.hba1cRange && (
                    <div className="text-xs text-gray-500">{details.drugProfile.hba1cRange}</div>
                  )}
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-1">Weight Loss</div>
                  <div className="text-2xl font-bold text-elevance-blue">-{details.drugProfile.weightLoss} kg</div>
                  {details.drugProfile.weightLossRange && (
                    <div className="text-xs text-gray-500">{details.drugProfile.weightLossRange}</div>
                  )}
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-1">CV Benefit</div>
                  <div className="text-lg font-bold text-green-600">{details.drugProfile.cvBenefit}</div>
                </div>
              </div>
            )}
          </div>

          {/* Indications */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">FDA-Approved Indications</h4>
            <div className="flex flex-wrap gap-2">
              {details.drugProfile.indications.map((indication, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-white/80 text-gray-700 rounded-lg text-sm border border-gray-200"
                >
                  {indication}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* AI-Generated Executive Summary & News */}
      {details.aiSummary && (
        <div className="mt-6 space-y-4">
          {/* Executive Summary */}
          <Card>
            <div className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-l-4 border-indigo-600">
              <div className="flex items-center mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">AI-Generated Executive Summary</h2>
              </div>
              <p className="text-base text-gray-800 leading-relaxed mb-4">
                {details.aiSummary.executiveSummary}
              </p>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-indigo-600" />
                  Key Highlights
                </h3>
                <ul className="space-y-2">
                  {details.aiSummary.keyHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Recent News & Updates */}
          <Card>
            <div className="p-6 border-l-4 border-blue-600">
              <div className="flex items-center mb-4">
                <Bell className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Recent News & Regulatory Updates</h2>
              </div>
              <div className="space-y-4">
                {details.aiSummary.recentNews.map((news, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 flex-1">{news.headline}</h3>
                      <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                        {new Date(news.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 italic">{news.source}</p>
                    <p className="text-sm text-gray-700">{news.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* All Content Sections - No Tabs, Everything Visible */}
      <div className="mt-6 space-y-6">
        {/* Efficacy Section */}
        <Card>
          <div className="p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-elevance-blue mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Clinical Efficacy</h2>
            </div>
            <EfficacyTab details={details} isPTCommittee={isPTCommittee} />
          </div>
        </Card>

        {/* Safety Section */}
        <Card>
          <div className="p-6 border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <ShieldAlert className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Safety Profile</h2>
            </div>
            <SafetyTab details={details} />
          </div>
        </Card>

        {/* Evidence Quality Section */}
        <Card>
          <div className="p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Evidence Quality</h2>
            </div>
            <EvidenceTab details={details} />
          </div>
        </Card>

        {/* Guidelines Section */}
        <Card>
          <div className="p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <Award className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Clinical Guidelines</h2>
            </div>
            <GuidelinesTab details={details} />
          </div>
        </Card>

        {/* Comparators Section */}
        <Card>
          <div className="p-6 border-l-4 border-orange-500">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-6 h-6 text-orange-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Comparator Analysis</h2>
            </div>
            <ComparatorsTab details={details} chartData={comparatorChartData} isPTCommittee={isPTCommittee} />
          </div>
        </Card>

        {/* Formulary Section */}
        <Card>
          <div className="p-6 border-l-4 border-indigo-500">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Formulary Status</h2>
            </div>
            <FormularyTab details={details} />
          </div>
        </Card>

        {/* Updates Section */}
        <Card>
          <div className="p-6 border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <Bell className="w-6 h-6 text-yellow-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Updates & Alerts</h2>
            </div>
            <UpdatesTab details={details} />
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

// Efficacy Tab Component
const EfficacyTab: React.FC<{ details: any; isPTCommittee: boolean }> = ({ details, isPTCommittee }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Summary Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isPTCommittee ? (
          <>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">HbA1c Reduction</div>
              <div className="text-2xl font-bold text-elevance-blue">
                -{details.drugProfile?.hba1cReduction}%
              </div>
              {details.drugProfile?.hba1cRange && (
                <div className="text-xs text-gray-500 mt-1">{details.drugProfile.hba1cRange}</div>
              )}
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Weight Loss</div>
              <div className="text-2xl font-bold text-green-700">-{details.drugProfile?.weightLoss} kg</div>
              {details.drugProfile?.weightLossRange && (
                <div className="text-xs text-gray-500 mt-1">{details.drugProfile.weightLossRange}</div>
              )}
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">CV Outcomes</div>
              <div className="text-lg font-bold text-purple-700">{details.drugProfile?.cvBenefit}</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">EASI-75 Response</div>
              <div className="text-2xl font-bold text-elevance-blue">
                {details.drugProfile?.easiImprovement}%
              </div>
              <div className="text-xs text-gray-500 mt-1">≥75% improvement</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">IGA Clearance</div>
              <div className="text-2xl font-bold text-green-700">{details.drugProfile?.igaClearance}%</div>
              <div className="text-xs text-gray-500 mt-1">IGA 0/1 (clear/almost clear)</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Efficacy Rate</div>
              <div className="text-2xl font-bold text-purple-700">{details.drugProfile?.efficacyRate}%</div>
              <div className="text-xs text-gray-500 mt-1">Overall response rate</div>
            </div>
          </>
        )}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Cost Per Year</div>
          <div className="text-2xl font-bold text-orange-700">
            ${(details.drugProfile?.costPerYear / 1000).toFixed(0)}K
          </div>
        </div>
      </div>
    </div>

    {/* PA Criteria for Prior Auth use case */}
    {!isPTCommittee && details.paCriteria && details.paCriteria.length > 0 && (
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Prior Authorization Criteria</h3>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Key requirements for approval:</strong> The following criteria are evaluated during the prior authorization review process.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {details.paCriteria.map((criteria: any, idx: number) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 ${
                criteria.required
                  ? 'bg-red-50 border-red-300'
                  : 'bg-blue-50 border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm">{criteria.criteriaType}</h4>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    criteria.required
                      ? 'bg-red-200 text-red-800'
                      : 'bg-blue-200 text-blue-800'
                  }`}
                >
                  {criteria.required ? 'REQUIRED' : 'OPTIONAL'}
                </span>
              </div>
              <p className="text-xs text-gray-700">{criteria.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Pivotal Clinical Trials</h3>
      <div className="space-y-4">
        {details.clinicalTrials?.map((trial: any, idx: number) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{trial.name || trial.id}</h4>
                {trial.trialType && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {trial.trialType}
                  </span>
                )}
              </div>
              {trial.publicationLink && (
                <a
                  href={trial.publicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-elevance-blue hover:text-elevance-blue-dark"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
              <div>
                <span className="text-gray-600">Participants:</span>
                <span className="ml-1 font-semibold">{trial.participants?.toLocaleString()}</span>
              </div>
              {trial.duration && (
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-1 font-semibold">{trial.duration}</span>
                </div>
              )}
              {trial.comparator && (
                <div>
                  <span className="text-gray-600">Comparator:</span>
                  <span className="ml-1 font-semibold">{trial.comparator}</span>
                </div>
              )}
              {trial.nctId && (
                <div>
                  <span className="text-gray-600">NCT ID:</span>
                  <span className="ml-1 font-semibold text-elevance-blue">{trial.nctId}</span>
                </div>
              )}
            </div>

            {trial.population && (
              <p className="text-sm text-gray-700 mb-2">
                <strong>Population:</strong> {trial.population}
              </p>
            )}

            <p className="text-sm text-gray-700 mb-2">
              <strong>Primary Outcome:</strong> {trial.primaryOutcome}
            </p>

            <div className="bg-white rounded p-3 mb-2">
              <p className="text-sm font-semibold text-elevance-blue">{trial.result}</p>
            </div>

            {trial.maceResults && (
              <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                <div className="bg-white rounded p-2">
                  <div className="text-gray-600">Treatment</div>
                  <div className="font-bold">{trial.maceResults.treatment}%</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="text-gray-600">Control</div>
                  <div className="font-bold">{trial.maceResults.control}%</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="text-gray-600">Hazard Ratio</div>
                  <div className="font-bold text-green-700">{trial.maceResults.hazardRatio}</div>
                  <div className="text-gray-500">{trial.maceResults.confidenceInterval}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Safety Tab Component
const SafetyTab: React.FC<{ details: any }> = ({ details }) => {
  if (!details.safetyData) {
    return <div className="text-gray-500">No safety data available</div>;
  }

  return (
    <div className="space-y-6">
      {details.safetyData?.blackBoxWarnings && details.safetyData.blackBoxWarnings.length > 0 && (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Black Box Warning</h3>
            {details.safetyData.blackBoxWarnings.map((warning: string, idx: number) => (
              <p key={idx} className="text-sm text-red-800">{warning}</p>
            ))}
          </div>
        </div>
      </div>
    )}

    {details.safetyData?.adverseEvents && details.safetyData.adverseEvents.length > 0 && (
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Adverse Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700">Event</th>
                <th className="text-center p-3 font-semibold text-gray-700">Treatment Rate</th>
                <th className="text-center p-3 font-semibold text-gray-700">Control Rate</th>
                <th className="text-center p-3 font-semibold text-gray-700">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {details.safetyData.adverseEvents.map((ae: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{ae.event}</td>
                  <td className="text-center p-3 text-gray-700">{ae.treatmentRate}%</td>
                  <td className="text-center p-3 text-gray-700">{ae.controlRate}%</td>
                  <td className="text-center p-3">
                    <span className={`font-semibold ${ae.treatmentRate - ae.controlRate > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      +{(ae.treatmentRate - ae.controlRate).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {details.safetyData?.discontinuationRate && (
          <p className="text-sm text-gray-600 mt-2">
            Discontinuation rate due to adverse events: <strong>{details.safetyData.discontinuationRate}%</strong>
          </p>
        )}
      </div>
    )}

    {details.safetyData?.seriousAdverseEvents && details.safetyData.seriousAdverseEvents.length > 0 && (
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Serious Adverse Events</h3>
        <div className="space-y-2">
          {details.safetyData.seriousAdverseEvents.map((sae: any, idx: number) => (
            <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="flex items-start justify-between">
                <span className="font-semibold text-gray-900">{sae.event}</span>
                <span className="text-sm font-medium text-yellow-800">{sae.incidence}%</span>
              </div>
              {sae.notes && <p className="text-xs text-gray-600 mt-1">{sae.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    )}

    {details.safetyData?.warnings && details.safetyData.warnings.length > 0 && (
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Warnings & Precautions</h3>
        <ul className="space-y-2">
          {details.safetyData.warnings.map((warning: string, idx: number) => (
            <li key={idx} className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{warning}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    </div>
  );
};

// Evidence Quality Tab Component
const EvidenceTab: React.FC<{ details: any }> = ({ details }) => {
  const evidence = details.evidenceQuality;
  if (!evidence) return <div className="text-gray-500">No evidence quality data available</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Clinical Program Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Total Trials</div>
            <div className="text-3xl font-bold text-elevance-blue">{evidence.totalTrials}</div>
            {evidence.trialSeries && (
              <div className="text-xs text-gray-500 mt-1">{evidence.trialSeries}</div>
            )}
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Total Patients</div>
            <div className="text-3xl font-bold text-green-700">{evidence.totalPatients.toLocaleString()}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Duration Range</div>
            <div className="text-lg font-bold text-purple-700">{evidence.durationRange}</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">CVOT Status</div>
            <div className="text-lg font-bold text-orange-700">{evidence.hasCVOT ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Study Design Quality</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Randomized Controlled Trials</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{evidence.rctCount}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Double-Blind Studies</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{evidence.doubleBlindCount}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active-Controlled Trials</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{evidence.activeControlCount}</div>
          </div>
        </div>
      </div>

      {evidence.population && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Population Characteristics</h3>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {evidence.population.meanAge && (
                <div>
                  <span className="text-gray-600">Mean Age:</span>
                  <span className="ml-2 font-semibold">{evidence.population.meanAge} years</span>
                </div>
              )}
              {evidence.population.ageRange && (
                <div>
                  <span className="text-gray-600">Age Range:</span>
                  <span className="ml-2 font-semibold">{evidence.population.ageRange}</span>
                </div>
              )}
              {evidence.population.femalePercent && (
                <div>
                  <span className="text-gray-600">Female:</span>
                  <span className="ml-2 font-semibold">{evidence.population.femalePercent}%</span>
                </div>
              )}
              {evidence.population.baselineHbA1c && (
                <div>
                  <span className="text-gray-600">Baseline HbA1c:</span>
                  <span className="ml-2 font-semibold">{evidence.population.baselineHbA1c}%</span>
                </div>
              )}
              {evidence.population.diabetesDuration && (
                <div>
                  <span className="text-gray-600">Diabetes Duration:</span>
                  <span className="ml-2 font-semibold">{evidence.population.diabetesDuration} years</span>
                </div>
              )}
            </div>

            {evidence.population.racialBreakdown && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Racial/Ethnic Distribution</h4>
                <div className="flex gap-4">
                  {evidence.population.racialBreakdown.white && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                      <span className="text-sm">White: {evidence.population.racialBreakdown.white}%</span>
                    </div>
                  )}
                  {evidence.population.racialBreakdown.black && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                      <span className="text-sm">Black: {evidence.population.racialBreakdown.black}%</span>
                    </div>
                  )}
                  {evidence.population.racialBreakdown.asian && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                      <span className="text-sm">Asian: {evidence.population.racialBreakdown.asian}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Guidelines Tab Component
const GuidelinesTab: React.FC<{ details: any }> = ({ details }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-gray-900 mb-4">Clinical Guidelines & Recommendations</h3>
    {details.guidelines?.map((guideline: any, idx: number) => (
      <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-lg font-bold text-gray-900">{guideline.organization}</h4>
            <p className="text-xs text-gray-600">Published: {guideline.yearPublished}</p>
          </div>
          <span className="px-3 py-1 bg-elevance-blue text-white rounded-full text-xs font-semibold">
            {guideline.evidenceLevel}
          </span>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed">{guideline.recommendation}</p>
      </div>
    ))}
  </div>
);

// Comparators Tab Component
const ComparatorsTab: React.FC<{ details: any; chartData: any; isPTCommittee: boolean }> = ({
  details,
  chartData,
  isPTCommittee,
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Head-to-Head Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700">Drug Name</th>
              {isPTCommittee && (
                <>
                  <th className="text-center p-3 font-semibold text-gray-700">HbA1c Reduction</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Weight Loss</th>
                  <th className="text-center p-3 font-semibold text-gray-700">MACE Reduction</th>
                </>
              )}
              <th className="text-center p-3 font-semibold text-gray-700">Efficacy Score</th>
              <th className="text-center p-3 font-semibold text-gray-700">Cost/Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {details.comparatorDrugs?.map((drug: any, idx: number) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-900">{drug.name}</td>
                {isPTCommittee && (
                  <>
                    <td className="text-center p-3 text-gray-700">
                      {drug.hba1c ? `-${drug.hba1c}%` : 'N/A'}
                    </td>
                    <td className="text-center p-3 text-gray-700">
                      {drug.weightLoss ? `-${drug.weightLoss} kg` : 'N/A'}
                    </td>
                    <td className="text-center p-3 text-gray-700">
                      {drug.maceReduction ? `${drug.maceReduction}%` : 'N/A'}
                    </td>
                  </>
                )}
                <td className="text-center p-3 font-semibold text-elevance-blue">{drug.efficacy}%</td>
                <td className="text-center p-3 text-gray-700">${(drug.cost / 1000).toFixed(1)}K</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {chartData && isPTCommittee && (
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Efficacy vs. Cost Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#1A3673" label={{ value: 'HbA1c / Weight Loss', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#44b8f3" label={{ value: 'Cost ($K)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="HbA1c" fill="#1A3673" name="HbA1c Reduction (%)" />
              <Bar yAxisId="left" dataKey="Weight Loss (kg)" fill="#4ade80" name="Weight Loss (kg)" />
              <Bar yAxisId="right" dataKey="Cost ($K)" fill="#44b8f3" name="Cost ($K)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}
  </div>
);

// Formulary Tab Component
const FormularyTab: React.FC<{ details: any }> = ({ details }) => {
  const formulary = details.formularyStatus;
  if (!formulary) return <div className="text-gray-500">No formulary data available</div>;

  return (
    <div className="space-y-6">
      {formulary.medicareCoverage && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Medicare Part D Coverage (2024)</h3>
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200 mb-4">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-elevance-blue">{formulary.medicareCoverage.coveragePercent}%</div>
              <div className="text-sm text-gray-600">of Part D plans cover this drug</div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Tier Distribution</h4>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(formulary.medicareCoverage.tierDistribution).map(([tier, percent]) => (
                  <div key={tier} className="bg-white rounded p-2 text-center">
                    <div className="text-xs text-gray-600 capitalize">{tier.replace('tier', 'Tier ')}</div>
                    <div className="text-lg font-bold text-gray-900">{percent as number}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {formulary.pbmStatus && formulary.pbmStatus.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Major PBM Status</h3>
          <div className="space-y-3">
            {formulary.pbmStatus.map((pbm: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{pbm.pbm}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      pbm.status === 'Covered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {pbm.status}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                      Tier {pbm.tier}
                    </span>
                  </div>
                </div>
                {pbm.notes && <p className="text-sm text-gray-600">{pbm.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {formulary.vaFormulary && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">VA National Formulary</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Status:</span>
              <span className={`px-3 py-1 rounded font-semibold ${
                formulary.vaFormulary.status === 'Formulary' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {formulary.vaFormulary.status}
              </span>
            </div>
            {formulary.vaFormulary.criteria && (
              <p className="text-sm text-gray-600 mt-2">{formulary.vaFormulary.criteria}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Updates Tab Component
const UpdatesTab: React.FC<{ details: any }> = ({ details }) => (
  <div className="space-y-4">
    {details.safetyData && !details.safetyData.blackBoxWarnings && (
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-center">
        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
        <span className="font-semibold text-green-900">No Active Safety Alerts</span>
      </div>
    )}

    {details.updates && details.updates.length > 0 && (
      <>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Updates</h3>
        <div className="space-y-3">
          {details.updates.map((update: any, idx: number) => (
            <div
              key={idx}
              className={`rounded-lg p-4 border-l-4 ${
                update.type === 'safety'
                  ? 'bg-red-50 border-red-500'
                  : update.type === 'indication'
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-purple-50 border-purple-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                      update.type === 'safety'
                        ? 'bg-red-100 text-red-700'
                        : update.type === 'indication'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {update.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{update.message}</p>
                </div>
                <span className="text-xs text-gray-500 ml-4">{new Date(update.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);
