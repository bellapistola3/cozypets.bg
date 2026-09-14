import 'package:provider/provider.dart';
import '../services/gemini_service.dart';
import '../providers/generation_provider.dart';

class CaptionGeneratorScreen extends StatefulWidget {
  const CaptionGeneratorScreen({Key? key}) : super(key: key);

  @override
  State<CaptionGeneratorScreen> createState() => _CaptionGeneratorScreenState();
}

class _CaptionGeneratorScreenState extends State<CaptionGeneratorScreen> {
  final _topicController = TextEditingController();
  final String _selectedPlatform = 'instagram'; // In a real app, this could be a selector
  String _selectedTone = 'casual';
  bool _isLoading = false;
  List<String>? _captions;

  final List<String> _tones = ['professional', 'casual', 'funny', 'inspiring', 'educational'];

  Future<void> _generateCaptions() async {
    if (_topicController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter a topic')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _captions = null;
    });

    final result = await GeminiService.generateCaption(
      platform: _selectedPlatform,
      topic: _topicController.text,
      tone: _selectedTone,
    );

    setState(() {
      _isLoading = false;
      if (result['success']) {
        _captions = List<String>.from(result['data']);
        
        // Sync with Firestore
        final generationProvider = Provider.of<GenerationProvider>(context, listen: false);
        generationProvider.incrementCaptions(
          platform: _selectedPlatform,
          input: {
            'topic': _topicController.text,
            'tone': _selectedTone,
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
        title: Text('Caption Generator'),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _topicController,
              decoration: InputDecoration(
                labelText: 'Topic',
                hintText: 'What is your post about?',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface,
              ),
              maxLines: 3,
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedTone,
              decoration: InputDecoration(
                labelText: 'Tone',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface,
              ),
              items: _tones.map((tone) {
                return DropdownMenuItem(value: tone, child: Text(tone.toUpperCase()));
              }).toList(),
              onChanged: (value) => setState(() => _selectedTone = value!),
            ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _generateCaptions,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                minimumSize: Size(double.infinity, 56),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: _isLoading
                  ? CircularProgressIndicator(color: Colors.white)
                  : Text('Generate Captions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
            SizedBox(height: 32),
            if (_captions != null)
              ...List.generate(_captions!.length, (index) {
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
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Caption ${index + 1}', style: TextStyle(fontWeight: FontWeight.bold)),
                          IconButton(
                            icon: Icon(Icons.copy, size: 20),
                            onPressed: () {
                              Clipboard.setData(ClipboardData(text: _captions![index]));
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Copied!')),
                              );
                            },
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      Text(_captions![index]),
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
