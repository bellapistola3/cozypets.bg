import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Database, Users, Calendar, Star } from 'lucide-react';
import { dbHelpers, auth } from '../lib/firebase';
import Button from './common/Button';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  data?: any;
}

const DatabaseTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u: any) => {
      setCurrentUser(u);
    });
    return () => unsubscribe();
  }, []);

  const updateTest = (name: string, status: 'success' | 'error' | 'pending', message: string, data?: any) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.data = data;
        return [...prev];
      } else {
        return [...prev, { name, status, message, data }];
      }
    });
  };

  const runDatabaseTests = async () => {
    setIsRunning(true);
    setTests([]);

    try {
      // Test 1: Get Platform Statistics
      updateTest('Platform Stats', 'pending', 'Fetching platform statistics...');
      try {
        const platformStats = await dbHelpers.getPlatformStats();
        setStats(platformStats);
        updateTest('Platform Stats', 'success',
          `Found ${platformStats.totalUsers} users, ${platformStats.totalSitters} sitters, ${platformStats.totalReservations} reservations`,
          platformStats
        );
      } catch (error) {
        updateTest('Platform Stats', 'error', `Failed to fetch stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 1.5: Test Profile Functions
      updateTest('Profile Functions', 'pending', 'Testing profile creation and retrieval...');
      try {
        // Test creating a profile
        const testProfile = await dbHelpers.createOrUpdateProfile({
          id: 'test-user-123',
          full_name: 'Test User',
          email: 'test@example.com',
          role: 'owner'
        });

        // Test getting the profile
        const retrievedProfile = await (dbHelpers as any).getUserByAuthId('test-user-123');

        updateTest('Profile Functions', 'success',
          `Profile created and retrieved successfully`,
          { created: testProfile, retrieved: retrievedProfile }
        );
      } catch (error) {
        updateTest('Profile Functions', 'error', `Profile functions failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 2: Get Sitters
      updateTest('Sitters Query', 'pending', 'Fetching sitters...');
      try {
        const sitters = await dbHelpers.getSitters();
        updateTest('Sitters Query', 'success',
          `Found ${sitters.length} sitters in database`,
          sitters.slice(0, 3)
        );
      } catch (error) {
        updateTest('Sitters Query', 'error', `Failed to fetch sitters: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 2.5: Test Sitter Profile Functions
      updateTest('Sitter Profile Functions', 'pending', 'Testing sitter profile functions...');
      try {
        // Test creating a sitter profile
        const testSitter = await dbHelpers.createOrUpdateSitter({
          id: 'test-sitter-123',
          profile_title: 'Test Sitter',
          bio: 'This is a test sitter profile',
          price_24h: 50,
          pet_types: ['kuche', 'kotka']
        });

        // Test getting the sitter profile
        const retrievedSitter = await dbHelpers.getSitterProfile('test-sitter-123');

        updateTest('Sitter Profile Functions', 'success',
          `Sitter profile created and retrieved successfully`,
          { created: testSitter, retrieved: retrievedSitter }
        );
      } catch (error) {
        updateTest('Sitter Profile Functions', 'error', `Sitter profile functions failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      // Test 3: Get Sitters with Filters
      updateTest('Filtered Sitters', 'pending', 'Testing sitter filters...');
      try {
        const filteredSitters = await dbHelpers.getSitters({
          location: 'София',
          min_rating: 4.5
        });
        updateTest('Filtered Sitters', 'success',
          `Found ${filteredSitters.length} sitters in София with rating ≥ 4.5`,
          filteredSitters
        );
      } catch (error) {
        updateTest('Filtered Sitters', 'error', `Failed to filter sitters: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 4: Get User Pets
      updateTest('User Pets', 'pending', 'Fetching user pets...');
      try {
        const pets = await dbHelpers.getUserPets('1');
        updateTest('User Pets', 'success',
          `Found ${pets.length} pets for user 1`,
          pets
        );
      } catch (error) {
        updateTest('User Pets', 'error', `Failed to fetch pets: ${error}`);
      }

      // Test 5: Get User Reservations
      updateTest('User Reservations', 'pending', 'Fetching user reservations...');
      try {
        const reservations = await dbHelpers.getUserReservations('1');
        updateTest('User Reservations', 'success',
          `Found ${reservations.length} reservations for user 1`,
          reservations.slice(0, 2)
        );
      } catch (error) {
        updateTest('User Reservations', 'error', `Failed to fetch reservations: ${error}`);
      }

      // Test 6: Get Sitter Reviews
      updateTest('Sitter Reviews', 'pending', 'Fetching sitter reviews...');
      try {
        const reviews = await dbHelpers.getSitterReviews('1');
        updateTest('Sitter Reviews', 'success',
          `Found ${reviews.length} reviews for sitter 1`,
          reviews
        );
      } catch (error) {
        updateTest('Sitter Reviews', 'error', `Failed to fetch reviews: ${error}`);
      }

    } catch (error) {
      console.error('Database test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600 animate-pulse" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <Database className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Database Functionality Test
              </h1>
              <p className="text-gray-600">
                Test all database operations and verify data integrity
              </p>
              <div className={`mt-4 inline-block px-4 py-2 rounded-lg text-sm font-semibold ${currentUser ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Auth Status: {currentUser ? `Logged in as ${currentUser.email} (${currentUser.uid})` : 'Not logged in'}
              </div>
            </div>

            {/* Platform Statistics */}
            {stats && (
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.totalSitters}</div>
                  <div className="text-sm text-gray-600">Active Sitters</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.totalReservations}</div>
                  <div className="text-sm text-gray-600">Reservations</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-6 text-center">
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stats.totalRevenue} лв.</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <Button
                onClick={runDatabaseTests}
                disabled={isRunning}
                className={isRunning ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {isRunning ? 'Running Tests...' : 'Run Database Tests'}
              </Button>
            </div>

            {/* Test Results */}
            {tests.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
                {tests.map((test: TestResult, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {getStatusIcon(test.status)}
                        <h3 className="font-semibold text-gray-900 ml-2">{test.name}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${test.status === 'success' ? 'bg-green-100 text-green-800' :
                        test.status === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {test.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{test.message}</p>

                    {test.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-green-600 hover:text-green-700">
                          View Data
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(test.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Test Summary */}
            {tests.length > 0 && !isRunning && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Test Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {tests.filter(t => t.status === 'success').length}
                    </div>
                    <div className="text-sm text-gray-600">Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {tests.filter(t => t.status === 'error').length}
                    </div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">
                      {tests.length}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;