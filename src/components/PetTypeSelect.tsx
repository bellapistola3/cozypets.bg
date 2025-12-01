import React from "react";

interface PetTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const PetTypeSelect: React.FC<PetTypeSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-800">
        Какъв е вашият домашен любимец? <span className="text-red-500">*</span>
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      >
        <option value="">Изберете вид животно</option>
        <option value="dog">Куче</option>
        <option value="cat">Котка</option>
        <option value="bird">Птица</option>
        <option value="small_mammal">Дребен бозайник</option>
        <option value="reptile">Влечуго</option>
        <option value="other">Друг</option>
      </select>
    </div>
  );
};
