import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

// Deterministic mock data so the chart looks "real" but doesn't reshuffle on every render.
const data = [
  { day: 'Mon', sessions: 12, requests: 240 },
  { day: 'Tue', sessions: 19, requests: 312 },
  { day: 'Wed', sessions: 14, requests: 280 },
  { day: 'Thu', sessions: 22, requests: 410 },
  { day: 'Fri', sessions: 28, requests: 520 },
  { day: 'Sat', sessions: 18, requests: 380 },
  { day: 'Sun', sessions: 25, requests: 470 },
]

export default function ActivityChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass relative overflow-hidden rounded-2xl p-5"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
            Last 7 days
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-50">
            Sign-in activity
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <Legend color="#22D3EE" label="Sessions" />
          <Legend color="#8B5CF6" label="Requests" />
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-cyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-violet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(161,161,170,0.7)', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(161,161,170,0.7)', fontSize: 11 }}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }}
              contentStyle={{
                background: 'rgba(14,14,19,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: 12,
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
              }}
              labelStyle={{ color: '#a1a1aa' }}
            />
            <Area
              type="monotone"
              dataKey="requests"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#grad-violet)"
            />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#22D3EE"
              strokeWidth={2}
              fill="url(#grad-cyan)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5 text-zinc-400">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 8px ${color}80`,
        }}
      />
      {label}
    </div>
  )
}
