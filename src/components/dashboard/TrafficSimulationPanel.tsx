import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Users,
  Zap,
  Gauge,
  Layers,
  Cpu,
  StopCircle,
  Play,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TrafficSimulationPanel: React.FC = () => {
  const { loadSim, startLoadSimulation, stopLoadSimulation, resetLoadSimulation } = useApp();

  const [usersInput, setUsersInput] = useState<number>(10000);
  const [rpsInput, setRpsInput] = useState<number>(500000);
  const [durationInput, setDurationInput] = useState<number>(60);

  const handleStart = () => {
    startLoadSimulation(usersInput, rpsInput, durationInput);
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm">
      {/* Top Title Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Traffic & Concurrency Simulation Engine
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-semibold">
              Prototype Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulate flash-sale traffic surges, concurrency spikes, backpressure queues, and system response
          </p>
        </div>

        {/* Buttons: START TEST, STOP TEST, RESET */}
        <div className="flex items-center gap-2">
          {!loadSim.isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow-md shadow-rose-600/20 transition-all transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START TEST</span>
            </button>
          ) : (
            <button
              onClick={stopLoadSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 font-bold text-xs rounded-lg transition-all animate-pulse"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>STOP TEST ({loadSim.durationSeconds - loadSim.elapsedSeconds}s)</span>
            </button>
          )}

          <button
            onClick={() => {
              resetLoadSimulation();
              setUsersInput(10000);
              setRpsInput(500000);
              setDurationInput(60);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Sliders Configuration Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-b border-slate-100 dark:border-slate-800">
        {/* Slider 1: Concurrent Users */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" /> Concurrent Users
            </span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {usersInput.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={1000}
            max={50000}
            step={1000}
            value={usersInput}
            disabled={loadSim.isRunning}
            onChange={(e) => setUsersInput(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>1,000</span>
            <span>10,000</span>
            <span>50,000</span>
          </div>
        </div>

        {/* Slider 2: Requests / sec */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-rose-500" /> Requests / sec
            </span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
              {rpsInput.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={10000}
            max={1000000}
            step={25000}
            value={rpsInput}
            disabled={loadSim.isRunning}
            onChange={(e) => setRpsInput(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>10k</span>
            <span>500k</span>
            <span>1M</span>
          </div>
        </div>

        {/* Slider 3: Duration */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-amber-500" /> Duration (seconds)
            </span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {durationInput}s
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={180}
            step={5}
            value={durationInput}
            disabled={loadSim.isRunning}
            onChange={(e) => setDurationInput(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>10s</span>
            <span>60s</span>
            <span>180s</span>
          </div>
        </div>
      </div>

      {/* Simulated Live Output Metrics */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            Simulated System Response Telemetry
          </span>
          {loadSim.isRunning && (
            <div className="flex items-center gap-2 text-xs font-mono text-rose-500 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              TEST RUNNING — {loadSim.elapsedSeconds}s / {loadSim.durationSeconds}s
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Concurrent Users */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">Concurrent Users</span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
              {loadSim.metrics.activeUsers.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">Simulated Clients</span>
          </div>

          {/* 2. Requests/sec */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">Requests / sec</span>
            <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
              {loadSim.metrics.currentRps.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">Simulated Target</span>
          </div>

          {/* 3. Success Rate */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">Success Rate</span>
            <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {loadSim.metrics.successRate}%
            </div>
            <span className="text-[10px] text-slate-400">0.03% Throttled</span>
          </div>

          {/* 4. Average Latency */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">Avg Latency</span>
            <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
              {loadSim.metrics.avgLatencyMs} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <span className="text-[10px] text-slate-400">p99: 142ms</span>
          </div>

          {/* 5. Queue Depth */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">Queue Depth</span>
            <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
              {loadSim.metrics.queueDepth.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">Kafka Buffer</span>
          </div>

          {/* 6. CPU Utilization */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">CPU Utilization</span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
              {loadSim.metrics.cpuUtilization}%
            </div>
            <span className="text-[10px] text-slate-400">Autoscaled Pods</span>
          </div>
        </div>
      </div>
    </div>
  );
};
