// Minimal client-side logic: auth (localStorage) + coin change algorithms
(function(){
  // ---- Auth helpers ----
  function _readUsers(){
    try{ return JSON.parse(localStorage.getItem('cc_users')||'[]'); }catch(e){return []}
  }
  function _writeUsers(u){ localStorage.setItem('cc_users', JSON.stringify(u)); }

  // Initialize demo account on first use
  function _initializeDemoAccount(){
    const users = _readUsers();
    // Check if demo account already exists
    if(!users.find(x => x.username === 'saptarshi')){
      users.push({username: 'saptarshi', password: '2005'});
      _writeUsers(users);
    }
  }
  _initializeDemoAccount();

  window.createUser = function(username, password){
    if(!username || !password) return {success:false, message:'Username and password required'};
    const users = _readUsers();
    if(users.find(x=>x.username===username)) return {success:false, message:'Username already exists'};
    users.push({username:username, password:password});
    _writeUsers(users);
    return {success:true};
  };

  window.loginUser = function(username,password){
    const users = _readUsers();
    const u = users.find(x=>x.username===username && x.password===password);
    if(!u) return {success:false, message:'Invalid credentials'};
    localStorage.setItem('cc_currentUser', username);
    return {success:true};
  };

  window.currentUser = function(){ return localStorage.getItem('cc_currentUser'); };
  window.logout = function(){ localStorage.removeItem('cc_currentUser'); };

  window.ensureAuth = function(){
    // No longer enforces auth. Login is now fully optional.
    // Calculator is accessible without login.
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
