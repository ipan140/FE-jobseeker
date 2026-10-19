import React from 'react';

export default function Footer() {
  return (
    <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors">
      <div className="flex items-center gap-1.5 font-medium">
        <span className="text-orange-600 dark:text-orange-500 font-bold">Jobseekers Portal</span>
        <span>Ecosystem © {new Date().getFullYear()}</span>
      </div>
      <div>
        <span>Powered by </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">Jobseekers Indonesia Enterprise</span>
      </div>
    </footer>
  );
}
