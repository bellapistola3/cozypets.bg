import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class AdminPanelScreen extends StatelessWidget {
  const AdminPanelScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final db = authProvider.dbService;

    if (db == null) return Scaffold(body: Center(child: Text('Not Authenticated')));

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text('Admin Control Panel'),
      ),
      body: StreamBuilder<Map<String, dynamic>>(
        stream: db.globalStats,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          final stats = snapshot.data ?? {};

          return ListView(
            padding: EdgeInsets.all(20),
            children: [
              _buildStatCard(
                context,
                title: 'Total Users',
                value: stats['totalUsers']?.toString() ?? '0',
                icon: Icons.people,
                color: Colors.blue,
              ),
              SizedBox(height: 16),
              _buildStatCard(
                context,
                title: 'Total AI Generations',
                value: stats['totalGenerations']?.toString() ?? '0',
                icon: Icons.auto_awesome,
                color: Colors.purple,
              ),
              SizedBox(height: 32),
              Text(
                'Recent Users',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 16),
              // Search bar placeholder
              TextField(
                decoration: InputDecoration(
                  hintText: 'Search users...',
                  prefixIcon: Icon(Icons.search),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
                ),
                onSubmitted: (query) async {
                   final results = await db.searchUsers(query);
                   // Display results logic
                },
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: color.withOpacity(0.1),
            child: Icon(icon, color: color),
          ),
          SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: TextStyle(color: Colors.white70)),
              Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }
}
