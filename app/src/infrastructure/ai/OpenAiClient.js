class OpenAiClient {
  constructor({ apiKey, enabled }) {
    this.apiKey = apiKey;
    this.enabled = enabled && Boolean(apiKey);
  }

  async generateExplanation(summary) {
    if (!this.enabled) {
      throw new Error('AI disabled');
    }

    const prompt = [
      'Write 1-2 concise sentences explaining why this assignee was recommended for a software ticket.',
      'Keep it grounded in the provided facts only.',
      `Ticket title: ${summary.title}`,
      `Ticket label: ${summary.label}`,
      `Recommended assignee: ${summary.recommendedAssignee.name}`,
      `History score: ${summary.scoreBreakdown.historyScore}`,
      `Workload penalty: ${summary.scoreBreakdown.workloadPenalty}`,
      `Specialization bonus: ${summary.scoreBreakdown.specializationBonus}`,
      summary.alternateAssignee ? `Alternate assignee: ${summary.alternateAssignee.name}` : '',
      summary.dueDate ? `Due date: ${summary.dueDate}` : ''
    ].filter(Boolean).join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'You explain recommendations for engineering task assignment.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 120
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error('Empty AI response');
    }

    return text;
  }
}

module.exports = OpenAiClient;

