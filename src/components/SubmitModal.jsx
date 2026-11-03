import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Top Tier Coding',
  'Intelligence Engines',
  'Visual Synthesis',
  'Video & Audio',
  'Productivity',
  'Frontend & UI',
  'Backend & Deploy',
  'Research & Academic',
  'Tool Collections',
];

export default function SubmitModal({ isOpen, onClose, onSubmitTool }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [pricing, setPricing] = useState('free');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a tool name.');
      return;
    }

    if (!url.trim()) {
      setError('Please provide a valid website URL.');
      return;
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    if (!desc.trim()) {
      setError('Please provide a brief description.');
      return;
    }

    const newTool = {
      name: name.trim(),
      url: formattedUrl,
      category,
      pricing,
      desc: desc.trim(),
      isCustom: true,
      popular: false,
    };

    onSubmitTool(newTool);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setName('');
      setUrl('');
      setDesc('');
      onClose();
    }, 1400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-lg bg-[#111116] border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Plus size={16} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Submit an AI Tool</h3>
                <p className="text-xs text-zinc-400">Add a new tool directly to your catalog</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          {success ? (
            <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400"
              >
                <CheckCircle2 size={32} />
              </motion.div>
              <h4 className="text-lg font-bold text-white">Tool Added Successfully!</h4>
              <p className="text-xs text-zinc-400 max-w-xs">
                {name} is now saved in your browser and visible in your catalog.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-xs">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Tool Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-300">Tool Name</label>
                <input
                  type="text"
                  placeholder="e.g. Supabase, Claude, Cursor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-lg px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              {/* Website URL */}
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-300">Website URL</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-lg px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-zinc-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-[#181820] border border-white/[0.08] focus:border-cyan-500/50 rounded-lg px-3 py-2 text-white focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-zinc-300">Pricing Tier</label>
                  <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] p-1 rounded-lg">
                    {['free', 'freemium', 'paid'].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setPricing(tier)}
                        className={`flex-1 py-1 rounded capitalize font-medium transition-colors ${
                          pricing === tier
                            ? 'bg-white text-zinc-950 font-semibold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-300">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="One sentence describing what makes this tool awesome..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.08] focus:border-cyan-500/50 rounded-lg px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  Add Tool
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
