function recommendContent(score) {
    // Define content recommendations based on score ranges
    const recommendations = {
      0: ['Blog A', 'Video B'],
      5: ['Blog C', 'Video D'],
      10: ['Blog E', 'Video F'],
      // Add more score ranges and corresponding recommendations as needed
    };
  
    // Find the appropriate recommendation for the given score
    for (const range in recommendations) {
      if (score >= parseInt(range)) {
        return recommendations[range];
      }
    }
  
    // Default recommendation if the score doesn't match any defined range
    return ['No recommendations available'];
  }
  
  module.exports = recommendContent;