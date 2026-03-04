const express = require('express');
const router = express.Router();

// Greedy Algorithm
router.post('/greedy', (req, res) => {
  let { amount, denoms } = req.body;
  if (!Array.isArray(denoms) || denoms.length === 0) return res.json({ success: false, data: null });
  
  denoms = denoms.filter(d => d > 0);
  denoms.sort((a, b) => b - a);
  
  let rem = amount;
  const seq = [];
  const byDenom = {};
  
  for (const c of denoms) {
    while (rem >= c) {
      rem -= c;
      seq.push(c);
      byDenom[c] = (byDenom[c] || 0) + 1;
    }
  }
  
  if (rem !== 0) return res.json({ success: false, message: 'No valid change combination found.' });
  res.json({ success: true, data: { count: seq.length, sequence: seq, byDenom } });
});

// DP Algorithm
router.post('/dp', (req, res) => {
  let { amount, denoms } = req.body;
  if (!Array.isArray(denoms) || denoms.length === 0) return res.json({ success: false, data: null });
  
  denoms = denoms.filter(d => d > 0);
  const INF = 1e9;
  const dp = new Array(amount + 1).fill(INF);
  const prev = new Array(amount + 1).fill(-1);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const c of denoms) {
      if (c <= i && dp[i - c] + 1 < dp[i]) {
        dp[i] = dp[i - c] + 1;
        prev[i] = c;
      }
    }
  }
  
  if (dp[amount] >= INF) return res.json({ success: false, message: 'No valid change combination found.' });
  
  // reconstruct
  let cur = amount;
  const seq = [];
  const byDenom = {};
  
  while (cur > 0) {
    const c = prev[cur];
    if (c === -1) break; // safety
    seq.push(c);
    byDenom[c] = (byDenom[c] || 0) + 1;
    cur -= c;
  }
  
  res.json({ success: true, data: { count: seq.length, sequence: seq.reverse(), byDenom } });
});

module.exports = router;
