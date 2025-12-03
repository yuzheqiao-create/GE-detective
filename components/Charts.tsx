import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GenderStats } from '../types';

interface GenderRatioChartProps {
  stats: GenderStats;
}

export const GenderRatioChart: React.FC<GenderRatioChartProps> = ({ stats }) => {
  const data = [
    { name: '男性', value: stats.maleCount },
    { name: '女性', value: stats.femaleCount },
  ];
  
  // Add unknown only if > 0
  if (stats.unknownCount > 0) {
    data.push({ name: '未明', value: stats.unknownCount });
  }

  // Check if empty
  const total = stats.maleCount + stats.femaleCount + stats.unknownCount;
  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
        未检测到人物
      </div>
    );
  }

  const COLORS = ['#6366f1', '#ec4899', '#94a3b8']; // Indigo (Male), Pink (Female), Slate (Unknown)

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#1f2937' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};