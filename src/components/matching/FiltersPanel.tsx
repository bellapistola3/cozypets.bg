import React from 'react';
import { Filters } from '../../types/matching';
import { Sliders } from 'lucide-react';

interface FiltersPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleAvailability = (tag: string) => {
    const current = filters.availability;
    const updated = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    updateFilter('availability', updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
          <Sliders className="w-5 h-5 text-pink-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Филтри</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            🐾 Вид животно
          </label>
          <select
            value={filters.animalType}
            onChange={(e) => updateFilter('animalType', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white transition-all duration-200"
          >
            <option value="any">Всички</option>
            <option value="dog">🐕 Куче</option>
            <option value="cat">🐈 Котка</option>
            <option value="rabbit">🐰 Заек</option>
            <option value="bird">🐦 Птица</option>
            <option value="other">🦎 Друго</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📅 Период
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value || null)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all duration-200"
              placeholder="От дата"
            />
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => updateFilter('dateTo', e.target.value || null)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all duration-200"
              placeholder="До дата"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            📍 Разстояние: <span className="text-pink-600">{filters.maxDistanceKm} км</span>
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={filters.maxDistanceKm}
            onChange={(e) => updateFilter('maxDistanceKm', parseInt(e.target.value))}
            className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            style={{
              background: `linear-gradient(to right, #FF7DAA 0%, #FF7DAA ${(filters.maxDistanceKm / 50) * 100}%, #E5E7EB ${(filters.maxDistanceKm / 50) * 100}%, #E5E7EB 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1 км</span>
            <span>50 км</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            💰 Цена на час
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Мин"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all duration-200"
            />
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Макс"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            ⭐ Опит
          </label>
          <select
            value={filters.minExperienceYears || 0}
            onChange={(e) => updateFilter('minExperienceYears', parseInt(e.target.value) || null)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white transition-all duration-200"
          >
            <option value="0">Всички</option>
            <option value="1">1+ години</option>
            <option value="3">3+ години</option>
            <option value="5">5+ години</option>
          </select>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-pink-50 transition-colors duration-200">
            <input
              type="checkbox"
              checked={filters.onlyCertified}
              onChange={(e) => updateFilter('onlyCertified', e.target.checked)}
              className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-2 focus:ring-pink-500"
            />
            <span className="text-sm font-semibold text-gray-700">
              🏆 Само сертифицирани
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            📆 Наличност
          </label>
          <div className="space-y-2">
            {[
              { value: 'weekdays', label: 'Делнични дни', icon: '🏢' },
              { value: 'weekends', label: 'Уикенди', icon: '🎉' },
              { value: 'holidays', label: 'Празници', icon: '🎊' }
            ].map(({ value, label, icon }) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-purple-50 transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={filters.availability.includes(value)}
                  onChange={() => toggleAvailability(value)}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {icon} {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
