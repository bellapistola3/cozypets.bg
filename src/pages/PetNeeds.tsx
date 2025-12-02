import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LunaMascot from '../components/mascots/LunaMascot';
import { Sparkles } from 'lucide-react';

const PetNeeds: React.FC = () => {
  const navigate = useNavigate();
  const [petData, setPetData] = useState({
    name: '',
    species: 'dog',
    age: 3,
    weight: 10,
    temperament: [] as string[],
    energyLevel: 50,
    sensitivities: [] as string[],
    notes: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzePet = () => {
    const result = {
      petProfile: `${petData.name} е ${petData.temperament.join(', ')} ${petData.species} на ${petData.age} години с ${petData.energyLevel > 50 ? 'високо' : 'средно'} енергийно ниво.`,
      careNeeds: `Изисква редовни грижи, внимание и активности съобразени с енергийното ниво.`,
      riskFactors: petData.sensitivities.length > 0 ? `Внимание към: ${petData.sensitivities.join(', ')}` : 'Минимални рискови фактори',
      environmentFit: 'Подходяща среда с опитни гледачи',
      personalityMatch: 5,
      petFitScore: 87,
      aiAdvice: 'Силно препоръчваме гледачи с опит с този тип животни'
    };
    setAnalysis(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <LunaMascot variant="insight" size="large" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Understand Your Pet's Needs
          </h1>
          <p className="text-xl text-gray-600">
            Luna will analyze your pet's personality and care requirements
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pet Profile</h2>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pet Name</label>
                <input
                  type="text"
                  value={petData.name}
                  onChange={(e) => setPetData({...petData, name: e.target.value})}
                  className="cozy-input w-full"
                  placeholder="e.g., Max"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Species</label>
                <select
                  value={petData.species}
                  onChange={(e) => setPetData({...petData, species: e.target.value})}
                  className="cozy-input w-full"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Age: {petData.age} years</label>
              <input
                type="range"
                min="0"
                max="20"
                value={petData.age}
                onChange={(e) => setPetData({...petData, age: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Temperament</label>
              <div className="flex flex-wrap gap-2">
                {['calm', 'playful', 'shy', 'energetic', 'sensitive'].map(temp => (
                  <button
                    key={temp}
                    onClick={() => {
                      const updated = petData.temperament.includes(temp)
                        ? petData.temperament.filter(t => t !== temp)
                        : [...petData.temperament, temp];
                      setPetData({...petData, temperament: updated});
                    }}
                    className={`cozy-tag cursor-pointer ${
                      petData.temperament.includes(temp) ? 'bg-pink-500 text-white' : ''
                    }`}
                  >
                    {temp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
              <textarea
                value={petData.notes}
                onChange={(e) => setPetData({...petData, notes: e.target.value})}
                className="cozy-input w-full h-24"
                placeholder="Any special needs or behaviors..."
              />
            </div>
          </div>

          <button
            onClick={analyzePet}
            className="cozy-button-primary w-full mt-6 text-lg py-4"
          >
            <Sparkles className="inline w-5 h-5 mr-2" />
            Analyze My Pet with AI
          </button>
        </div>

        {analysis && (
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-slideUp">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Analysis Results</h2>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 mb-2">Pet Profile</h3>
                <p className="text-gray-700">{analysis.petProfile}</p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-bold text-green-900 mb-2">Care Needs</h3>
                <p className="text-gray-700">{analysis.careNeeds}</p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4">
                <h3 className="font-bold text-yellow-900 mb-2">Risk Factors</h3>
                <p className="text-gray-700">{analysis.riskFactors}</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-bold text-purple-900 mb-2">Pet Fit Score</h3>
                <div className="text-4xl font-bold text-purple-600">{analysis.petFitScore}%</div>
              </div>

              <div className="bg-pink-50 rounded-xl p-4">
                <h3 className="font-bold text-pink-900 mb-2">AI Advice</h3>
                <p className="text-gray-700">{analysis.aiAdvice}</p>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.setItem('petProfile', JSON.stringify(petData));
                navigate('/match');
              }}
              className="cozy-button-primary w-full mt-6 text-lg py-4"
            >
              Use This Profile in Match Center
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetNeeds;