import 'package:provider/provider.dart';
import '../services/gemini_service.dart';
import '../providers/generation_provider.dart';

class HashtagGeneratorScreen extends StatefulWidget {
  const HashtagGeneratorScreen({Key? key}) : super(key: key);

  @override
  State<HashtagGeneratorScreen> createState() => _HashtagGeneratorScreenState();
}

class _HashtagGeneratorScreenState extends State<HashtagGeneratorScreen> {
  final _nicheController = TextEditingController();
  final _keywordsController = TextEditingController();
  String _selectedPlatform = 'instagram';
  bool _isLoading = false;
  Map<String, List<String>>? _hashtags;

  final List<Map<String, dynamic>> _platforms = [
    {'id': 'instagram', 'name': 'Instagram', 'icon': Icons.camera_alt},
    {'id': 'tiktok', 'name': 'TikTok', 'icon': Icons.music_note},
    {'id': 'x', 'name': 'X (Twitter)', 'icon': Icons.alternate_email},
    {'id': 'facebook', 'name': 'Facebook', 'icon': Icons.facebook},
  ];

  Future<void> _generateHashtags() async {
    if (_nicheController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter a niche')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _hashtags = null;
    });

    final keywords = _keywordsController.text
        .split(',')
        .map((k) => k.trim())
        .where((k) => k.isNotEmpty)
        .toList();

    final result = await GeminiService.generateHashtags(
      platform: _selectedPlatform,
      niche: _nicheController.text,
      keywords: keywords.isEmpty ? [_nicheController.text] : keywords,
    );

    setState(() {
      _isLoading = false;
      if (result['success']) {
        _hashtags = Map<String, List<String>>.from(
          result['data'].map((key, value) => MapEntry(
            key,
            List<String>.from(value),
          )),
        );
        
        // Sync with Firestore via Provider
        final generationProvider = Provider.of<GenerationProvider>(context, listen: false);
        generationProvider.incrementHashtags(
          platform: _selectedPlatform,
          input: {
            'niche': _nicheController.text,
            'keywords': keywords,
          },
          result: result['data'],
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${result['error']}')),
        );
      }
    });
  }

  void _copyHashtags(List<String> hashtags) {
    Clipboard.setData(ClipboardData(text: hashtags.join(' ')));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Copied to clipboard!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text('Hashtag Generator'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Platform selector
              Text(
                'Select Platform',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              SizedBox(height: 12),
              Wrap(
                spacing: 12,
                children: _platforms.map((platform) {
                  final isSelected = _selectedPlatform == platform['id'];
                  return ChoiceChip(
                    label: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(platform['icon'], size: 16),
                        SizedBox(width: 4),
                        Text(platform['name']),
                      ],
                    ),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() => _selectedPlatform = platform['id']);
                    },
                    selectedColor: Theme.of(context).colorScheme.primary,
                    backgroundColor: Theme.of(context).colorScheme.surface,
                  );
                }).toList(),
              ),
              SizedBox(height: 24),
              
              // Niche input
              TextField(
                controller: _nicheController,
                decoration: InputDecoration(
                  labelText: 'Niche/Topic',
                  hintText: 'e.g., fitness, travel, food',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
                ),
              ),
              SizedBox(height: 16),
              
              // Keywords input
              TextField(
                controller: _keywordsController,
                decoration: InputDecoration(
                  labelText: 'Keywords (optional)',
                  hintText: 'workout, gym, health (comma separated)',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
                ),
              ),
              SizedBox(height: 24),
              
              // Generate button
              ElevatedButton(
                onPressed: _isLoading ? null : _generateHashtags,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  minimumSize: Size(double.infinity, 56),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: _isLoading
                    ? CircularProgressIndicator(color: Colors.white)
                    : Text(
                        'Generate Hashtags',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
              SizedBox(height: 32),
              
              // Results
              if (_hashtags != null) ...[
                _buildHashtagSection('High Competition', _hashtags!['high']!),
                SizedBox(height: 16),
                _buildHashtagSection('Medium Competition', _hashtags!['medium']!),
                SizedBox(height: 16),
                _buildHashtagSection('Low Competition', _hashtags!['low']!),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHashtagSection(String title, List<String> hashtags) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              IconButton(
                icon: Icon(Icons.copy, size: 20),
                onPressed: () => _copyHashtags(hashtags),
                color: Theme.of(context).colorScheme.primary,
              ),
            ],
          ),
          SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: hashtags.map((tag) {
              return Chip(
                label: Text(tag),
                backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.2),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _nicheController.dispose();
    _keywordsController.dispose();
    super.dispose();
  }
}
