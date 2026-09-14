import 'package:provider/provider.dart';
import '../services/gemini_service.dart';
import '../providers/generation_provider.dart';

class ContentIdeasScreen extends StatefulWidget {
  const ContentIdeasScreen({Key? key}) : super(key: key);

  @override
  State<ContentIdeasScreen> createState() => _ContentIdeasScreenState();
}

class _ContentIdeasScreenState extends State<ContentIdeasScreen> {
  final _nicheController = TextEditingController();
  final String _selectedPlatform = 'instagram'; // Standardized
  String _contentType = 'reels';
  bool _isLoading = false;
  List<Map<String, dynamic>>? _ideas;

  Future<void> _generateIdeas() async {
    if (_nicheController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter a niche')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _ideas = null;
    });

    final result = await GeminiService.generateContentIdeas(
      platform: _selectedPlatform,
      niche: _nicheController.text,
      contentType: _contentType,
    );

    setState(() {
      _isLoading = false;
      if (result['success']) {
        _ideas = List<Map<String, dynamic>>.from(result['data']);
        
        // Sync with Firestore
        final generationProvider = Provider.of<GenerationProvider>(context, listen: false);
        generationProvider.incrementIdeas(
          platform: _selectedPlatform,
          input: {
            'niche': _nicheController.text,
            'contentType': _contentType,
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text('Content Ideas'),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(
              controller: _nicheController,
              decoration: InputDecoration(
                labelText: 'Niche',
                hintText: 'fitness, travel, food...',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface,
              ),
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _contentType,
              decoration: InputDecoration(
                labelText: 'Content Type',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface,
              ),
              items: ['reels', 'posts', 'stories', 'videos'].map((type) {
                return DropdownMenuItem(value: type, child: Text(type.toUpperCase()));
              }).toList(),
              onChanged: (value) => setState(() => _contentType = value!),
            ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _generateIdeas,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                minimumSize: Size(double.infinity, 56),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: _isLoading
                  ? CircularProgressIndicator(color: Colors.white)
                  : Text('Generate Ideas', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
            SizedBox(height: 32),
            if (_ideas != null)
              ...List.generate(_ideas!.length, (index) {
                final idea = _ideas![index];
                return Container(
                  margin: EdgeInsets.only(bottom: 16),
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Theme.of(context).colorScheme.primary,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text('#${index + 1}', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          ),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              idea['title'] ?? 'Idea ${index + 1}',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      if (idea['hook'] != null)
                        Text(
                          '🎯 ${idea['hook']}',
                          style: TextStyle(color: Theme.of(context).colorScheme.secondary),
                        ),
                      SizedBox(height: 4),
                      if (idea['description'] != null)
                        Text(idea['description'], style: TextStyle(color: Colors.white70)),
                    ],
                  ),
                );
              }),
          ],
        ),
      ),
    );
  }
}
