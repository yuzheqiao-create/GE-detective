import React from 'react';
import { AnalysisResult } from '../types';

interface ImprovementViewProps {
  result: AnalysisResult;
}

export const ImprovementView: React.FC<ImprovementViewProps> = ({ result }) => {
  const { suggestions } = result;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Suggestions for Rewriting */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-2">
           <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h3 className="font-semibold text-green-900">改进文本建议 (Rewrite Suggestions)</h3>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            {suggestions.rewriteTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reflection Questions */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-indigo-100/50 flex items-center gap-2">
           <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-semibold text-indigo-900">引导性思考问题 (Reflection Questions)</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-indigo-600/80 mb-4 font-medium">使用这些问题来指导讨论或自我反思：</p>
          <ul className="space-y-4">
            {suggestions.reflectionQuestions.map((question, idx) => (
              <li key={idx} className="bg-white/60 p-4 rounded-lg border border-indigo-50 text-indigo-900 italic">
                "{question}"
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};