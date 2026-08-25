import express from 'express';

const router = express.Router();

// Simulated AI endpoints for Note Summarization, Grammar Polish, Action Item Extraction & Mood Detection

router.post('/summarize', (req, res) => {
  const { text } = req.body;
  if (!text || text.length < 10) {
    return res.status(400).json({ error: 'Text must be at least 10 characters for AI summary.' });
  }

  const words = text.split(/\s+/);
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;

  const keySentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 15)
    .slice(0, 3);

  const summary = keySentences.length > 0 
    ? keySentences.join('. ') + '.'
    : text.slice(0, 150) + '...';

  res.json({
    summary: `✨ **AI Summary**: ${summary}`,
    keyTakeaways: [
      'Extracted key point from memory content.',
      'Identified core theme and structured overview.',
      `Calculated reading time: ${Math.ceil(words.length / 200)} min (${words.length} words, ${sentenceCount} sentences).`
    ],
    suggestedTags: words.length > 20 ? ['#key-notes', '#summary', '#ai-insights'] : ['#quick-note']
  });
});

router.post('/enhance', (req, res) => {
  const { text, tone } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required.' });

  let polished = text;
  if (tone === 'professional') {
    polished = text
      .replace(/gonna/gi, 'going to')
      .replace(/wanna/gi, 'want to')
      .replace(/btw/gi, 'by the way')
      .replace(/imo/gi, 'in my opinion');
    polished = `Formal Note Record:\n` + polished;
  } else if (tone === 'journal') {
    polished = `🌱 Reflected on ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}:\n` + text;
  } else {
    polished = text + `\n\n📌 *Key Takeaway*: Always document progress and keep momentum high.`;
  }

  res.json({ enhancedText: polished });
});

router.post('/extract-tasks', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required.' });

  const lines = text.split('\n');
  const actionItems = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (
      trimmed.toLowerCase().includes('todo') ||
      trimmed.toLowerCase().includes('action item') ||
      trimmed.toLowerCase().includes('follow up') ||
      trimmed.toLowerCase().includes('need to') ||
      trimmed.toLowerCase().includes('must') ||
      trimmed.startsWith('- [ ]') ||
      trimmed.startsWith('*')
    ) {
      actionItems.push(trimmed.replace(/^[-*]|\b(todo|action item|follow up):\b/gi, '').trim());
    }
  });

  if (actionItems.length === 0) {
    actionItems.push('Review and archive this memory entry');
    actionItems.push('Share updates with team/family');
  }

  res.json({ tasks: actionItems });
});

export default router;
