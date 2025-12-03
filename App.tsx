import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { analyzeText } from './services/geminiService';
import { AnalysisResult, AnalysisStatus, AnalysisHistoryItem } from './types';
import { AnalysisReport } from './components/AnalysisReport';
import { ImprovementView } from './components/ImprovementView';
import { HistoryView } from './components/HistoryView';

// Text examples from the PDF
const EXAMPLE_TEXT_1 = `历史名人：战国时期的李冰父子主持修建了都江堰水利工程；汉代的李广抗击匈奴，威名远扬；隋代的李春是著名的桥梁专家，举世闻名的赵州桥就是他设计并参加建造的；唐代的李白被誉为“诗仙”；宋代的李清照是一位词人，有“千古第一才女”之称；明代的李时珍编写了我国古代药物学巨著《本草纲目》；近现代的李大钊是中国共产党的创始人之一……`;

const EXAMPLE_TEXT_2 = `我爸爸是一个工厂的计划科科长，擅长订计划。在家里，他也给我们订了计划。妈妈有学习电子技术的计划，外婆有学习烹调的计划，我有作息计划、复习功课计划，他自己有读书计划、读报计划、做家务计划，每个人还有如何订计划的计划、如何督促各人执行计划的计划…… 爸爸执行计划一丝不苟。男人们在午前就出动，到亲戚家、朋友家去拜年。女人们在家中接待客人。`;

function App() {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'suggestions' | 'history'>('report');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ge_detective_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history when updated
  useEffect(() => {
    localStorage.setItem('ge_detective_history', JSON.stringify(history));
  }, [history]);

  // If no result but we have history, user might want to see history tab.
  // But we default to 'report'. If report is empty, we handle display logic in render.
  useEffect(() => {
     if (status === AnalysisStatus.IDLE && history.length > 0 && result === null) {
        // Optional: could auto-switch to history, but might be annoying on refresh.
        // Keeping 'report' active by default is fine, as we will conditionally render the container.
        setActiveTab('history');
     }
  }, [status, history.length, result]);


  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setStatus(AnalysisStatus.ANALYZING);
    setErrorMessage(null);
    setActiveTab('report');

    try {
      const data = await analyzeText(inputText);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETE);

      // Add to history
      const newHistoryItem: AnalysisHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        text: inputText,
        result: data,
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const loadExample = (text: string) => {
    setInputText(text);
    if(status === AnalysisStatus.COMPLETE) {
        setStatus(AnalysisStatus.IDLE);
        setResult(null);
        setActiveTab('report');
    }
  };

  const loadHistoryItem = (item: AnalysisHistoryItem) => {
    setInputText(item.text);
    setResult(item.result);
    setStatus(AnalysisStatus.COMPLETE);
    setActiveTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const hasResult = status === AnalysisStatus.COMPLETE && result !== null;
  const showTabs = hasResult || history.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Input Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">
                输入文本进行检测
              </label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => loadExample(EXAMPLE_TEXT_1)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition-colors"
                >
                  加载示例一
                </button>
                <button 
                  onClick={() => loadExample(EXAMPLE_TEXT_2)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition-colors"
                >
                  加载示例二
                </button>
              </div>
            </div>
            
            <textarea
              id="text-input"
              rows={6}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-800 p-4 border resize-none"
              placeholder="在此粘贴叙事文本、故事或文章..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <div className="mt-4 flex justify-end items-center gap-4">
               {history.length > 0 && status === AnalysisStatus.IDLE && (
                 <button 
                   onClick={() => setActiveTab('history')}
                   className="text-sm text-gray-500 hover:text-indigo-600 underline"
                 >
                   查看历史记录 ({history.length})
                 </button>
               )}

              <button
                onClick={handleAnalyze}
                disabled={status === AnalysisStatus.ANALYZING || !inputText.trim()}
                className={`
                  px-6 py-2.5 rounded-lg text-white font-medium shadow-md transition-all
                  ${status === AnalysisStatus.ANALYZING || !inputText.trim()
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:transform active:scale-95'
                  }
                `}
              >
                {status === AnalysisStatus.ANALYZING ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在分析...
                  </span>
                ) : '开始检测'}
              </button>
            </div>
            
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                {errorMessage}
              </div>
            )}
          </div>
        </section>

        {/* Results / Tabs Section */}
        {showTabs && (
          <section className="animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-center mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
               {/* Tab Buttons */}
               <button
                  onClick={() => setActiveTab('report')}
                  disabled={!hasResult}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'report'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : hasResult 
                        ? 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        : 'bg-gray-50 text-gray-300 border border-transparent cursor-not-allowed'
                  }`}
               >
                 分析报告
               </button>
               <button
                  onClick={() => setActiveTab('suggestions')}
                  disabled={!hasResult}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'suggestions'
                      ? 'bg-green-600 text-white shadow-md'
                      : hasResult
                        ? 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        : 'bg-gray-50 text-gray-300 border border-transparent cursor-not-allowed'
                  }`}
               >
                 改进建议
               </button>
               <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeTab === 'history'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
               >
                 历史记录
               </button>
            </div>

            <div className="transition-all duration-300 ease-in-out">
              {activeTab === 'report' && hasResult && result && (
                <AnalysisReport result={result} />
              )}
              {activeTab === 'suggestions' && hasResult && result && (
                <ImprovementView result={result} />
              )}
              {activeTab === 'history' && (
                <HistoryView history={history} onLoad={loadHistoryItem} onDelete={deleteHistoryItem} />
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;