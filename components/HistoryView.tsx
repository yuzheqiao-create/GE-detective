import React from 'react';
import { AnalysisHistoryItem } from '../types';

interface HistoryViewProps {
  history: AnalysisHistoryItem[];
  onLoad: (item: AnalysisHistoryItem) => void;
  onDelete: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onLoad, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-gray-900 font-medium text-lg">暂无历史记录</h3>
        <p className="text-gray-500 mt-1 max-w-sm">开始第一次检测后，您的分析结果将自动保存在这里。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {history.map((item) => (
        <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
               <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                 {new Date(item.timestamp).toLocaleDateString()}
               </span>
               <span className="text-xs text-gray-400">
                 {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
               </span>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                title="删除记录"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </button>
          </div>
          
          <div className="mb-4">
             <p className="text-gray-900 font-medium mb-2 line-clamp-2 text-base leading-relaxed">"{item.text}"</p>
             <div className="flex gap-4 text-sm text-gray-500 border-t border-gray-50 pt-3 mt-3">
                 <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span>男性: {item.result.stats.maleCount}</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    <span>女性: {item.result.stats.femaleCount}</span>
                 </div>
             </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 mb-4">
             <p className="text-sm text-gray-700 italic line-clamp-2">
               <span className="font-semibold text-gray-900 not-italic mr-2">总结:</span>
               {item.result.narrative.summary}
             </p>
          </div>

          <button
            onClick={() => onLoad(item)}
            className="w-full py-2.5 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white font-medium transition-all text-sm flex items-center justify-center gap-2 group-hover:shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            查看分析详情
          </button>
        </div>
      ))}
    </div>
  );
};