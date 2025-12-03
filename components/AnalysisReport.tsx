import React from 'react';
import { AnalysisResult } from '../types';
import { GenderRatioChart } from './Charts';

interface AnalysisReportProps {
  result: AnalysisResult;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
  const { stats, narrative } = result;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Section 1: Surface Level Stats */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="font-semibold text-lg text-indigo-900">表层性别表征 (Surface Level)</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chart */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4 text-center">性别比例 (Gender Ratio)</h3>
            <GenderRatioChart stats={stats} />
            <div className="mt-4 text-center text-sm text-gray-600">
              <span className="font-semibold text-indigo-600 text-base">{stats.maleCount} 男性</span> 
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-semibold text-pink-600 text-base">{stats.femaleCount} 女性</span>
            </div>
          </div>

          {/* Roles List */}
          <div>
             <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">职业角色分布 (Professional Roles)</h3>
             <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <div className="text-sm font-semibold text-gray-700">男性角色</div>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-4">
                    {stats.maleRoles.length > 0 ? stats.maleRoles.map((role, i) => (
                      <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-md border border-indigo-100 font-medium">
                        {role}
                      </span>
                    )) : <span className="text-gray-400 italic text-sm">未检测到</span>}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <div className="text-sm font-semibold text-gray-700">女性角色</div>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-4">
                    {stats.femaleRoles.length > 0 ? stats.femaleRoles.map((role, i) => (
                      <span key={i} className="px-3 py-1.5 bg-pink-50 text-pink-700 text-sm rounded-md border border-pink-100 font-medium">
                        {role}
                      </span>
                    )) : <span className="text-gray-400 italic text-sm">未检测到</span>}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Section 2: Deep Analysis */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <h2 className="font-semibold text-lg text-purple-900">深层叙事分析 (Deep Narrative Analysis)</h2>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Analysis Blocks */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-lg">
                <span className="text-purple-600">#</span> 人物特质（形容词分析）
              </h4>
              <p className="text-gray-700 leading-relaxed text-base text-justify">
                {narrative.adjectiveAnalysis}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-lg">
                <span className="text-purple-600">#</span> 社会角色或行为角色（行为模式/公共VS私人）
              </h4>
              <p className="text-gray-700 leading-relaxed text-base text-justify">
                {narrative.socialRoles}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-lg">
                 <span className="text-purple-600">#</span> 叙事逻辑与权力结构
              </h4>
              <p className="text-gray-700 leading-relaxed text-base text-justify">
                {narrative.powerDynamics}
              </p>
            </div>
          </div>
          
          {/* Summary */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex gap-3">
               <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
               </div>
               <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">分析总结</h4>
                  <p className="text-gray-600 italic">
                    {narrative.summary}
                  </p>
               </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};