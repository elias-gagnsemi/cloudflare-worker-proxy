/**
 * Test script for sentiment analysis on mocked Reddit data
 */

const redditPost = {
  title: "Is this game worth buying?",
  body: "I've been thinking about getting this game for a while but I'm not sure. The reviews are mixed and it's pretty expensive. What do you guys think?"
};

const topComments = [
  { score: 1234, comment: "Absolutely worth it! Best game I've played this year." },
  { score: 987, comment: "Waste of money. Don't buy it." },
  { score: 876, comment: "It's decent, not amazing but entertaining enough." },
  { score: 654, comment: "I love it! Worth every penny. Amazing graphics and gameplay." },
  { score: 543, comment: "Pretty mid honestly. Nothing special." },
  { score: 432, comment: "Garbage. Refunded after 2 hours." },
  { score: 321, comment: "Neutral experience. Some good parts, some bad." },
  { score: 298, comment: "Absolutely fantastic! Must buy!" },
  { score: 210, comment: "Could be better. Has potential but needs work." },
  { score: 187, comment: "Not terrible, but definitely not great either." }
];

async function analyzeSentiment(text) {
  const response = await fetch('https://openai-proxy.elias-c2c.workers.dev/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      instructions: "Analyze the sentiment. Respond with ONLY one word: 'good', 'bad', or 'neutral'. No explanation.",
      input: [
        {
          role: "user",
          content: text
        }
      ]
    })
  });

  const data = await response.json();
  
  // Extract sentiment from the response
  if (data.output && data.output[0] && data.output[0].content && data.output[0].content[0]) {
    return data.output[0].content[0].text.trim().toLowerCase();
  }
  return "unknown";
}

async function runTest() {
  console.log("🔍 Testing Sentiment Analysis on Reddit Post & Comments\n");
  console.log("=" .repeat(60));
  
  // Analyze post
  console.log("\n📝 Post:");
  console.log(`Title: ${redditPost.title}`);
  console.log(`Body: ${redditPost.body.substring(0, 80)}...`);
  const postSentiment = await analyzeSentiment(`${redditPost.title}\n\n${redditPost.body}`);
  console.log(`Sentiment: ${postSentiment.toUpperCase()}`);
  
  // Analyze comments
  console.log("\n💬 Top 10 Comments by Score:\n");
  
  const sentimentCounts = { good: 0, bad: 0, neutral: 0 };
  
  for (let i = 0; i < topComments.length; i++) {
    const comment = topComments[i];
    const sentiment = await analyzeSentiment(comment.comment);
    sentimentCounts[sentiment]++;
    
    console.log(`${(i + 1).toString().padStart(2)}. [Score: ${comment.score}]`);
    console.log(`    "${comment.comment}"`);
    console.log(`    → ${sentiment.toUpperCase()}\n`);
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log("=".repeat(60));
  console.log("\n📊 Summary:");
  console.log(`Post Sentiment: ${postSentiment.toUpperCase()}`);
  console.log(`\nComment Sentiment Breakdown:`);
  console.log(`  Good:    ${sentimentCounts.good} (${Math.round(sentimentCounts.good / 10 * 100)}%)`);
  console.log(`  Bad:     ${sentimentCounts.bad} (${Math.round(sentimentCounts.bad / 10 * 100)}%)`);
  console.log(`  Neutral:  ${sentimentCounts.neutral} (${Math.round(sentimentCounts.neutral / 10 * 100)}%)`);
  console.log("\n✅ Test completed!");
}

runTest().catch(console.error);

