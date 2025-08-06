// Authentication Utility for Ymir Sailing Club PWA

const SESSION_KEY = 'ymir_current_member';
const SESSION_EXPIRY_KEY = 'ymir_session_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Check admin credentials and return member data if valid
 * @param {string} memberNumber - Member number
 * @param {string} pin - 3-digit PIN
 * @returns {Object} Result with authorized flag and member data or error
 */
export async function checkAdminCredentials(memberNumber, pin) {
  try {
    // Import database functions dynamically to avoid circular dependencies
    const { verifyMemberCredentials, isAdmin } = await import('./database.js');
    
    // First verify the member credentials
    const member = await verifyMemberCredentials(memberNumber, pin);
    
    if (!member) {
      return {
        authorized: false,
        error: 'Invalid member number or PIN'
      };
    }
    
    // Check if the member is an admin
    const adminStatus = await isAdmin(memberNumber);
    
    if (!adminStatus) {
      return {
        authorized: false,
        error: 'Admin access required'
      };
    }
    
    return {
      authorized: true,
      member: member
    };
    
  } catch (error) {
    console.error('Error checking admin credentials:', error);
    return {
      authorized: false,
      error: 'Internal server error'
    };
  }
}

/**
 * Store user session in localStorage with expiration
 * @param {Object} member - Member data from login
 */
export function setUserSession(member) {
  const expiryTime = Date.now() + SESSION_DURATION;
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(member));
  localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
  
  // Dispatch custom event for other components to listen to
  window.dispatchEvent(new CustomEvent('userLogin', { detail: member }));
}

/**
 * Get current user session if valid
 * @returns {Object|null} Member data or null if not logged in/expired
 */
export function getCurrentUser() {
  try {
    const memberData = localStorage.getItem(SESSION_KEY);
    const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
    
    if (!memberData || !expiryTime) {
      return null;
    }
    
    // Check if session has expired
    if (Date.now() > parseInt(expiryTime)) {
      clearUserSession();
      return null;
    }
    
    return JSON.parse(memberData);
  } catch (error) {
    console.error('Error getting current user:', error);
    clearUserSession();
    return null;
  }
}

/**
 * Clear user session (logout)
 */
export function clearUserSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
  
  // Dispatch custom event for other components to listen to
  window.dispatchEvent(new CustomEvent('userLogout'));
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
  return getCurrentUser() !== null;
}

/**
 * Check if user is admin
 * @returns {boolean}
 */
export function isAdmin() {
  const user = getCurrentUser();
  return user && user.is_admin === true;
}

/**
 * Extend session (useful for keeping users logged in during activity)
 */
export function extendSession() {
  const user = getCurrentUser();
  if (user) {
    setUserSession(user);
  }
}

/**
 * Redirect to login page with return URL
 * @param {string} returnUrl - URL to return to after login
 */
export function redirectToLogin(returnUrl = null) {
  const currentPath = window.location.pathname + window.location.search;
  const targetUrl = returnUrl || currentPath;
  
  // Determine language and redirect accordingly
  const isIcelandic = window.location.pathname.startsWith('/is');
  const loginPath = isIcelandic ? '/is/profile' : '/en/profile';
  
  window.location.href = `${loginPath}?returnUrl=${encodeURIComponent(targetUrl)}`;
}

/**
 * Check authentication and redirect if not logged in
 * @param {string} returnUrl - URL to return to after login
 * @returns {Object|null} Current user or null if redirected
 */
export function requireAuth(returnUrl = null) {
  const user = getCurrentUser();
  
  if (!user) {
    redirectToLogin(returnUrl);
    return null;
  }
  
  return user;
}

/**
 * Check admin authentication and redirect if not admin
 * @param {string} returnUrl - URL to return to after login
 * @returns {Object|null} Current user or null if redirected
 */
export function requireAdmin(returnUrl = null) {
  const user = requireAuth(returnUrl);
  
  if (!user) {
    return null;
  }
  
  if (!user.is_admin) {
    alert('Admin access required');
    window.location.href = returnUrl || '/en/';
    return null;
  }
  
  return user;
}

/**
 * Initialize authentication system
 * Sets up event listeners and checks session on page load
 */
export function initAuth() {
  // Check session on page load
  const user = getCurrentUser();
  
  if (user) {
    // Extend session on page load if user is active
    extendSession();
    
    // Update UI to show logged-in state
    updateAuthUI(user);
  } else {
    // Update UI to show logged-out state
    updateAuthUI(null);
  }
  
  // Listen for login/logout events
  window.addEventListener('userLogin', (event) => {
    updateAuthUI(event.detail);
  });
  
  window.addEventListener('userLogout', () => {
    updateAuthUI(null);
  });
}

/**
 * Update UI elements based on authentication state
 * @param {Object|null} user - Current user or null
 */
function updateAuthUI(user) {
  // Update navigation badge if it exists
  const badge = document.getElementById('badge-messages');
  if (badge) {
    if (user) {
      // Load unread count for logged-in user
      loadUnreadMessageCount();
    } else {
      badge.style.display = 'none';
    }
  }
  
  // Update any other UI elements that depend on auth state
  const authDependentElements = document.querySelectorAll('[data-auth-required]');
  authDependentElements.forEach(element => {
    if (user) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  });
}

/**
 * Load unread message count for navigation badge
 */
async function loadUnreadMessageCount() {
  try {
    const user = getCurrentUser();
    if (!user) return;
    
    const response = await fetch(`/api/messages?action=unreadCount&memberNumber1=${user.member_number}`);
    const data = await response.json();
    
    if (data.success) {
      const badge = document.getElementById('badge-messages');
      if (badge) {
        badge.textContent = data.count;
        badge.style.display = data.count > 0 ? 'flex' : 'none';
      }
    }
  } catch (error) {
    console.error('Error loading unread count:', error);
  }
}

// Auto-initialize auth system when this module is imported
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
} 