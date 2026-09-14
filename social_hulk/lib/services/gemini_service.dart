import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/firebase_config.dart';

class GeminiService {
  static const String _baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  // Generate Hashtags
  static Future<Map<String, dynamic>> generateHashtags({
    required String platform,
    required String niche,
    required List<String> keywords,
  }) async {
    final prompt = '''
You are a professional social media expert specializing in $platform.

Generate exactly 30 relevant hashtags for a $niche account.
Keywords: ${keywords.join(', ')}

Categorize them into 3 groups:
- 10 high competition hashtags (1M+ posts)
- 10 medium competition hashtags (100K-1M posts)
- 10 low competition hashtags (<100K posts)

Return ONLY a JSON object in this exact format:
{
  "high": ["#hashtag1", "#hashtag2", ...],
  "medium": ["#hashtag1", "#hashtag2", ...],
  "low": ["#hashtag1", "#hashtag2", ...]
}
''';

    return await _callGemini(prompt);
  }
  
  // Generate Caption
  static Future<Map<String, dynamic>> generateCaption({
    required String platform,
    required String topic,
    required String tone,
    String? cta,
  }) async {
    final prompt = '''
You are a professional $platform content creator.

Write 5 engaging captions for a post about: $topic
Tone: $tone
${cta != null ? 'Call-to-action: $cta' : ''}

Requirements:
- Include relevant emojis
- Add 5 relevant hashtags at the end
- Make each caption unique and compelling
- Optimize for $platform's algorithm

Return ONLY a JSON array:
["caption 1", "caption 2", "caption 3", "caption 4", "caption 5"]
''';

    return await _callGemini(prompt);
  }
  
  // Generate Bio
  static Future<Map<String, dynamic>> generateBio({
    required String platform,
    required String profession,
    required List<String> keyPoints,
  }) async {
    final int charLimit = platform == 'instagram' ? 150 : 
                         platform == 'x' ? 160 : 200;
    
    final prompt = '''
Create 3 professional $platform bios for a $profession.

Key points to include: ${keyPoints.join(', ')}
Character limit: $charLimit characters

Requirements:
- Catchy and memorable
- Clear value proposition
- Include relevant emojis
- Conversion-focused

Return ONLY a JSON array:
["bio 1", "bio 2", "bio 3"]
''';

    return await _callGemini(prompt);
  }
  
  // Generate Content Ideas
  static Future<Map<String, dynamic>> generateContentIdeas({
    required String platform,
    required String niche,
    required String contentType,
  }) async {
    final prompt = '''
You are a viral content strategist for $platform.

Generate 10 trending content ideas for a $niche account.
Content type: $contentType

Requirements:
- Based on current trends
- High engagement potential
- Include hook/angle for each idea
- Platform-specific optimization

Return ONLY a JSON array of objects:
[
  {"title": "Idea title", "hook": "Engagement hook", "description": "Brief description"},
  ...
]
''';

    return await _callGemini(prompt);
  }
  
  // Private method to call Gemini API
  static Future<Map<String, dynamic>> _callGemini(String prompt) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl?key=${FirebaseConfig.geminiApiKey}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'contents': [{
            'parts': [{'text': prompt}]
          }],
          'generationConfig': {
            'temperature': 0.9,
            'topK': 40,
            'topP': 0.95,
            'maxOutputTokens': 2048,
          }
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final text = data['candidates'][0]['content']['parts'][0]['text'];
        
        // Try to parse as JSON
        try {
          return {'success': true, 'data': jsonDecode(text)};
        } catch (e) {
          // If not JSON, return as text
          return {'success': true, 'data': text};
        }
      } else {
        return {
          'success': false,
          'error': 'API Error: ${response.statusCode}',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'error': 'Network Error: $e',
      };
    }
  }
}
