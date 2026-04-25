import { Search, Activity } from 'lucide-react';

interface TopNavigationProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function TopNavigation({ searchTerm, onSearchChange }: TopNavigationProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-teal-600 font-bold text-xl">MedRisk Optimizer</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search patient by ID..."
              className="pl-10 pr-4 py-2 w-80 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg">
            <Activity className="w-5 h-5 text-slate-600" />
            <div>
              <div className="text-xs text-slate-500">Binary Risk Model</div>
              <div className="text-sm text-slate-900 font-medium">Severe but Recoverable vs Critical/Permanen</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
