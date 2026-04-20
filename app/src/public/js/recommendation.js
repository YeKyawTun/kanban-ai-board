window.recommendationView = (() => {
  function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function renderRecommendation(recommendation) {
    const container = document.getElementById('recommendation-panel');

    if (!recommendation) {
      container.innerHTML = `
        <h2>Recommendation</h2>
        <p class="muted">No recommendation yet.</p>
      `;
      return;
    }

    container.innerHTML = `
      <h2>Recommendation</h2>
      <div class="recommendation-card">
        <p><strong>Recommended:</strong> ${escapeHtml(recommendation.recommendedAssignee?.name || 'Unknown')}</p>
        ${recommendation.alternateAssignee ? `<p><strong>Alternate:</strong> ${escapeHtml(recommendation.alternateAssignee.name)}</p>` : ''}
        <p><strong>Explanation:</strong> ${escapeHtml(recommendation.explanation || '')}</p>
        <p><strong>Source:</strong> ${escapeHtml(recommendation.explanationSource || 'fallback')}</p>
        <button id="use-recommended-assignee-btn" type="button">
          Use recommended assignee
        </button>
      </div>
    `;
  }

  return { renderRecommendation };
})();
