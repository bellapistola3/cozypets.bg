import 'package:provider/provider.dart';
import '../services/gemini_service.dart';
import '../providers/generation_provider.dart';

class BioGeneratorScreen extends StatefulWidget {
  const BioGeneratorScreen({Key? key}) : super(key: key);

  @override
  State<BioGeneratorScreen> createState() => _BioGeneratorScreenState();
}

class _BioGeneratorScreenState extends State<BioGeneratorScreen> {
  final _professionController = TextEditingController();
  final _keyPointsController = TextEditingController();
  final String _selectedPlatform = 'instagram'; // Standardized
  bool _isLoading = false;
  List<String>? _bios;

  Future<void> _generateBios() async {
    if (_professionController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter your profession')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _bios = null;
    });

    final keyPoints = _keyPointsController.text
        .split(',')
        .map((k) => k.trim())
        .where((k) => k.isNotEmpty)
        .toList();

    final result = await GeminiService.generateBio(
      platform: _selectedPlatform,
      profession: _professionController.text,
      keyPoints: keyPoints.isEmpty ? ['professional', 'passionate'] : keyPoints,
    );

    setState(() {
      _isLoading = false;
      if (result['success']) {
        _bios = List<String>.from(result['data']);
        
        // Sync with Firestore
        final generationProvider = Provider.of<GenerationProvider>(context, listen: false);
        generationProvider.incrementBios(
          platform: _selectedPlatform,
          input: {
            'profession': _professionController.text,
            'keyPoints': keyPoints,
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
        title: Text('Bio Generator'),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(
              controller: _professionController,
              decoration: InputDecoration(
                labelText: 'Profession/Niche',
                hintText: 'e.g., Fitness Coach, Travel Blogger',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface,
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _keyPointsController,
              decoration: InputDecoration(
                labelText: 'Key Points (comma separated)',
                hintText: 'passionate, experienced, certified',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface,
              ),
            ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _generateBios,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                minimumSize: Size(double.infinity, 56),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: _isLoading
                  ? CircularProgressIndicator(color: Colors.white)
                  : Text('Generate Bios', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
            SizedBox(height: 32),
            if (_bios != null)
              ...List.generate(_bios!.length, (index) {
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
                          Text('Bio ${index + 1}', style: TextStyle(fontWeight: FontWeight.bold)),
                          IconButton(
                            icon: Icon(Icons.copy),
                            onPressed: () {
                              Clipboard.setData(ClipboardData(text: _bios![index]));
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Copied!')));
                            },
                          ),
                        ],
                      ),
                      Text(_bios![index]),
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
