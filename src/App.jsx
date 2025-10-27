import React, { useState } from 'react';
import { Plus, X, TrendingUp } from 'lucide-react';

export default function GammaBandsCalculator() {
  const [underlyings, setUnderlyings] = useState(['Crude', 'ES', 'NQ', 'GC', 'BTC']);
  const [newUnderlying, setNewUnderlying] = useState('');
  const [selectedUnderlying, setSelectedUnderlying] = useState('ES');
  const [days, setDays] = useState(256);
  const [settle, setSettle] = useState('');
  const [iv, setIv] = useState('');
  const [rrSkew, setRrSkew] = useState('');
  const [results, setResults] = useState(null);
  const [twoDecimals, setTwoDecimals] = useState(false);

  const addUnderlying = () => {
    if (newUnderlying.trim() && !underlyings.includes(newUnderlying.trim().toUpperCase())) {
      setUnderlyings([...underlyings, newUnderlying.trim().toUpperCase()]);
      setNewUnderlying('');
    }
  };

  const removeUnderlying = (underlying) => {
    if (underlyings.length > 1) {
      const newList = underlyings.filter(u => u !== underlying);
      setUnderlyings(newList);
      if (selectedUnderlying === underlying) {
        setSelectedUnderlying(newList[0]);
      }
    }
  };

  const formatNumber = (num) => {
    return twoDecimals ? num.toFixed(2) : num.toFixed(4);
  };

  const calculate = () => {
    const s = parseFloat(settle);
    const v = parseFloat(iv);
    const rr = parseFloat(rrSkew) / 100;

    if (isNaN(s) || isNaN(v) || isNaN(rr)) {
      return;
    }

    const gammaBand = s * (v / Math.sqrt(days)) / 100;
    
    const upperGammaBand1G = gammaBand * (1 + rr);
    const upperGammaBand_1_2G = upperGammaBand1G * 0.5;
    const upperGammaBand_1_4G = upperGammaBand1G * 0.25;
    
    const lowerGammaBand1G = Math.abs(gammaBand * (-1 + rr));
    const lowerGammaBand_1_2G = lowerGammaBand1G * 0.5;
    const lowerGammaBand_1_4G = lowerGammaBand1G * 0.25;

    setResults({
      gammaBand,
      upper: {
        oneG: upperGammaBand1G,
        halfG: upperGammaBand_1_2G,
        quarterG: upperGammaBand_1_4G
      },
      lower: {
        oneG: lowerGammaBand1G,
        halfG: lowerGammaBand_1_2G,
        quarterG: lowerGammaBand_1_4G
      }
    });
  };

  return (
    <div className="min-h-screen bg-black p-4 font-mono">
      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2 mb-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-black" />
            <span className="text-black font-bold text-sm tracking-wider">GAMMA BANDS CALCULATOR</span>
          </div>
          <div className="text-black text-xs">
            {new Date().toLocaleString('en-US', { 
              month: 'short', 
              day: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="border-2 border-orange-600">
          {/* Underlyings Management Bar */}
          <div className="bg-orange-600 px-4 py-2 border-b-2 border-orange-700">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-black text-xs font-bold mr-2">SECURITIES:</span>
              {underlyings.map(underlying => (
                <button
                  key={underlying}
                  onClick={() => setSelectedUnderlying(underlying)}
                  className={`px-3 py-1 text-xs font-bold transition-colors ${
                    selectedUnderlying === underlying
                      ? 'bg-black text-orange-500'
                      : 'bg-orange-700 text-white hover:bg-orange-800'
                  }`}
                >
                  {underlying}
                  {underlyings.length > 1 && (
                    <X
                      className="inline-block w-3 h-3 ml-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUnderlying(underlying);
                      }}
                    />
                  )}
                </button>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newUnderlying}
                  onChange={(e) => setNewUnderlying(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addUnderlying()}
                  placeholder="ADD"
                  className="px-2 py-1 text-xs bg-black text-orange-500 placeholder-orange-800 w-20 uppercase focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  onClick={addUnderlying}
                  className="p-1 bg-black text-orange-500 hover:bg-orange-900"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-black p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div>
                <div className="text-orange-500 text-xs mb-1 font-bold">UNDERLYING</div>
                <div className="bg-gray-900 border border-orange-800 px-2 py-2 text-orange-400 text-sm">
                  {selectedUnderlying}
                </div>
              </div>

              <div>
                <div className="text-orange-500 text-xs mb-1 font-bold">DAYS</div>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-orange-800 px-2 py-2 text-orange-400 text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value={256}>256</option>
                  <option value={365}>365</option>
                </select>
              </div>

              <div>
                <div className="text-orange-500 text-xs mb-1 font-bold">SETTLE</div>
                <input
                  type="number"
                  value={settle}
                  onChange={(e) => setSettle(e.target.value)}
                  step="0.01"
                  className="w-full bg-gray-900 border border-orange-800 px-2 py-2 text-orange-400 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <div className="text-orange-500 text-xs mb-1 font-bold">IV (%)</div>
                <input
                  type="number"
                  value={iv}
                  onChange={(e) => setIv(e.target.value)}
                  step="0.01"
                  className="w-full bg-gray-900 border border-orange-800 px-2 py-2 text-orange-400 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <div className="text-orange-500 text-xs mb-1 font-bold">RR SKEW (%)</div>
                <input
                  type="number"
                  value={rrSkew}
                  onChange={(e) => setRrSkew(e.target.value)}
                  step="0.01"
                  className="w-full bg-gray-900 border border-orange-800 px-2 py-2 text-orange-400 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={calculate}
                className="bg-orange-600 hover:bg-orange-700 text-black font-bold px-6 py-2 text-sm tracking-wider"
              >
                CALCULATE
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-xs font-bold">DECIMALS:</span>
                <button
                  onClick={() => setTwoDecimals(!twoDecimals)}
                  className={`px-3 py-1 text-xs font-bold ${
                    twoDecimals ? 'bg-orange-600 text-black' : 'bg-gray-900 text-orange-500 border border-orange-800'
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => setTwoDecimals(!twoDecimals)}
                  className={`px-3 py-1 text-xs font-bold ${
                    !twoDecimals ? 'bg-orange-600 text-black' : 'bg-gray-900 text-orange-500 border border-orange-800'
                  }`}
                >
                  4
                </button>
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div className="border-t-2 border-orange-900 pt-4">
                <div className="text-orange-500 text-xs font-bold mb-3 tracking-wider">
                  GAMMA BANDS - {selectedUnderlying}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Gamma Band */}
                  <div className="border-2 border-orange-800 bg-gray-900">
                    <div className="bg-orange-800 px-2 py-1 text-black text-xs font-bold">
                      GAMMA BAND
                    </div>
                    <div className="p-3">
                      <div className="text-orange-400 text-2xl font-bold font-mono">
                        {formatNumber(results.gammaBand)}
                      </div>
                    </div>
                  </div>

                  {/* Upper Bands */}
                  <div className="border-2 border-green-700 bg-gray-900">
                    <div className="bg-green-700 px-2 py-1 text-black text-xs font-bold">
                      UPPER BANDS
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-green-500">1G:</span>
                        <span className="text-green-400 font-bold">{formatNumber(results.upper.oneG)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-500">1/2G:</span>
                        <span className="text-green-400 font-bold">{formatNumber(results.upper.halfG)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-500">1/4G:</span>
                        <span className="text-green-400 font-bold">{formatNumber(results.upper.quarterG)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Lower Bands */}
                  <div className="border-2 border-red-700 bg-gray-900">
                    <div className="bg-red-700 px-2 py-1 text-black text-xs font-bold">
                      LOWER BANDS
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-red-500">1G:</span>
                        <span className="text-red-400 font-bold">{formatNumber(results.lower.oneG)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-red-500">1/2G:</span>
                        <span className="text-red-400 font-bold">{formatNumber(results.lower.halfG)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-red-500">1/4G:</span>
                        <span className="text-red-400 font-bold">{formatNumber(results.lower.quarterG)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-orange-600 px-4 py-1 mt-1 text-right">
          <span className="text-black text-xs font-bold">SBH DIGITAL LTD</span>
        </div>
      </div>
    </div>
  );
}