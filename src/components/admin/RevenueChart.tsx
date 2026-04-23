"use client";

import { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function RevenueChart({ data }: { data: { date: string, revenue: number }[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {
    return <div className="w-full h-[350px] mt-6 bg-gray-50 rounded-lg animate-pulse" />;
  }

  return (
    <div className="w-full mt-6" style={{ height: 350, minWidth: 100 }}>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }} 
            tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
            formatter={(value: number) => [`${value.toLocaleString()} Ks`, "Revenue"]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
