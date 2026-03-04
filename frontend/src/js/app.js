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

  // ---- Coin change algorithms (Backend API) ----
  window.greedyChange = async function(amount, denoms){
    try {
      const response = await fetch('/api/algorithms/greedy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, denoms })
      });
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (err) {
      console.error('Greedy fetch failed:', err);
      return null;
    }
  };

  window.dpChange = async function(amount, denoms){
    try {
      const response = await fetch('/api/algorithms/dp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, denoms })
      });
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (err) {
      console.error('DP fetch failed:', err);
      return null;
    }
  };

})();
