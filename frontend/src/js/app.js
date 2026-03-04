// Minimal client-side logic: auth (localStorage) + coin change algorithms
(function(){
  const API_URL = '/api/auth';

  window.createUser = async function(username, password){
    if(!username || !password) return {success:false, message:'Username and password required'};
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      return data; // { success: true/false, message: ... }
    } catch (err) {
      console.error('Registration failed:', err);
      return { success: false, message: 'Could not connect to the server.' };
    }
  };

  window.loginUser = async function(username,password){
    if(!username || !password) return {success:false, message:'Username and password required'};

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('cc_currentUser', data.username);
        localStorage.setItem('cc_token', data.token);
      }
      return data;
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, message: 'Could not connect to the server.' };
    }
  };

  window.currentUser = function(){ 
    const isTokenValid = localStorage.getItem('cc_token'); // Simple check, could decode JWT if needed
    if (!isTokenValid) return null;
    return localStorage.getItem('cc_currentUser'); 
  };
  
  window.logout = function(){ 
    localStorage.removeItem('cc_currentUser'); 
    localStorage.removeItem('cc_token'); 
  };

  window.ensureAuth = function(){
    // Utility function, currently auth is not strictly enforced sitewide
  };

  // ---- Coin change algorithms ----
  // Greedy: sort descending, pick largest until exhausted
  window.greedyChange = function(amount, denoms){
    if(!Array.isArray(denoms) || denoms.length===0) return null;
    denoms = denoms.filter(d=>d>0);
    denoms.sort((a,b)=>b-a);
    let rem = amount;
    const seq = [];
    const byDenom = {};
    for(const c of denoms){
      while(rem >= c){
        rem -= c; seq.push(c);
        byDenom[c] = (byDenom[c]||0)+1;
      }
    }
    if(rem !== 0) return null; // no solution
    return {count: seq.length, sequence: seq, byDenom};
  };

  // DP: classic coin change to minimize number of coins, reconstruct solution
  window.dpChange = function(amount, denoms){
    denoms = denoms.filter(d=>d>0);
    const INF = 1e9;
    const dp = new Array(amount+1).fill(INF);
    const prev = new Array(amount+1).fill(-1);
    dp[0] = 0;
    for(let i=1;i<=amount;i++){
      for(const c of denoms){
        if(c<=i && dp[i-c]+1 < dp[i]){
          dp[i] = dp[i-c]+1;
          prev[i] = c;
        }
      }
    }
    if(dp[amount] >= INF) return null;
    // reconstruct
    let cur = amount; const seq = []; const byDenom = {};
    while(cur>0){
      const c = prev[cur];
      if(c==-1) break; // safety
      seq.push(c);
      byDenom[c] = (byDenom[c]||0)+1;
      cur -= c;
    }
    return {count: seq.length, sequence: seq.reverse(), byDenom};
  };

  // Expose for debugging in console
  window.__cc = {createUser: window.createUser, loginUser: window.loginUser, greedyChange: window.greedyChange, dpChange: window.dpChange};

})();
