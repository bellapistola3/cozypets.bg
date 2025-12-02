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
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <Sliders className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Филтри</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Вид животно
          </label>
          <select
            value={filters.animalType}
            onChange={(e) => updateFilter('animalType', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="any">Всички</option>
            <option value="dog">Куче</option>
            <option value="cat">Котка</option>
            <option value="rabbit">Заек</option>
            <option value="bird">Птица</option>
            <option value="other">Друго</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Период
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value || null)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="От дата"
            />
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => updateFilter('dateTo', e.target.value || null)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="До дата"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Разстояние: до {filters.maxDistanceKm} км
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={filters.maxDistanceKm}
            onChange={(e) => updateFilter('maxDistanceKm', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 км</span>
            <span>50 км</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Цена на час
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Мин"
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Макс"
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Опит
          </label>
          <select
            value={filters.minExperienceYears || 0}
            onChange={(e) => updateFilter('minExperienceYears', parseInt(e.target.value) || null)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="0">Всички</option>
            <option value="1">1+ години</option>
            <option value="3">3+ години</option>
            <option value="5">5+ години</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onlyCertified}
              onChange={(e) => updateFilter('onlyCertified', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Само сертифицирани
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Наличност
          </label>
          <div className="space-y-2">
            {[
              { value: 'weekdays', label: 'Делнични дни' },
              { value: 'weekends', label: 'Уикенди' },
              { value: 'holidays', label: 'Празници' }
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.availability.includes(value)}
                  onChange={() => toggleAvailability(value)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
