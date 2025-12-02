import React, { useState, useEffect } from 'react';
import { Filters, MatchResult, SitterWithMatch } from '../../types/matching';
import { mockSitters } from '../../data/mockSitters';
import FiltersPanel from './FiltersPanel';
import MatchList from './MatchList';
import AliceInsights from './AliceInsights';
import { supabase } from '../../lib/supabaseClient';

const AIMatchCenter2: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    animalType: 'any',
    dateFrom: null,
    dateTo: null,
    maxDistanceKm: 20,
    minPrice: null,
    maxPrice: null,
    minExperienceYears: null,
    onlyCertified: false,
    availability: []
  });

  const [matches, setMatches] = useState<SitterWithMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<SitterWithMatch | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/alice-match-engine`;

      const { data: { session } } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      } else {
        headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          filters,
          sitters: mockSitters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const matchResults: MatchResult[] = await response.json();

      const matchesWithSitters: SitterWithMatch[] = matchResults.map(match => {
        const sitter = mockSitters.find(s => s.id === match.sitterId);
        if (!sitter) throw new Error(`Sitter not found: ${match.sitterId}`);
        return {
          ...match,
          sitter
        };
      });

      setMatches(matchesWithSitters);

      if (matchesWithSitters.length > 0 && !selectedMatch) {
        setSelectedMatch(matchesWithSitters[0]);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [filters]);

  const handleViewProfile = (match: SitterWithMatch) => {
    console.log('View profile:', match.sitter.name);
  };

  const handleRequestBooking = (match: SitterWithMatch) => {
    console.log('Request booking:', match.sitter.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Match Center 2.0
          </h1>
          <p className="text-gray-600">
            Alice ще ви помогне да намерите перфектния гледач за вашия любимец
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
          <aside className="lg:block">
            <FiltersPanel filters={filters} onFiltersChange={setFilters} />
          </aside>

          <main>
            <MatchList
              matches={matches}
              selectedSitterId={selectedMatch?.sitterId || null}
              onSelectSitter={setSelectedMatch}
              onViewProfile={handleViewProfile}
              onRequestBooking={handleRequestBooking}
              isLoading={isLoading}
            />
          </main>

          <aside className="lg:block">
            <AliceInsights selectedMatch={selectedMatch} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AIMatchCenter2;
