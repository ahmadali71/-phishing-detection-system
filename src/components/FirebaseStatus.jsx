import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { Cloud, CloudOff, AlertCircle } from 'lucide-react';

/**
 * FirebaseStatus - Shows Firebase/Firestore connection status
 * Add to Header or Dashboard to display sync status
 */
export default function FirebaseStatus() {
  const { firebaseReady, firebaseError, isLocalMode } = useAppData();

  if (!firebaseReady) {
    return (
      <div className="firebase-status initializing" title="Initializing Firestore connection...">
        <div className="status-icon loading">⏳</div>
        <span className="status-text">Connecting to Firestore...</span>
      </div>
    );
  }

  if (firebaseError) {
    return (
      <div className="firebase-status error" title={`Firestore error: ${firebaseError}`}>
        <AlertCircle size={16} />
        <span className="status-text">Offline mode (localStorage)</span>
      </div>
    );
  }

  if (isLocalMode) {
    return (
      <div className="firebase-status offline" title="Using local storage - Firestore unavailable">
        <CloudOff size={16} />
        <span className="status-text">Offline</span>
      </div>
    );
  }

  return (
    <div className="firebase-status online" title="Connected to Firestore - Data syncing">
      <Cloud size={16} />
      <span className="status-text">Synced</span>
    </div>
  );
}

/**
 * CSS Styles - Add to your App.css or global styles
 */
const FirebaseStatusStyles = `
.firebase-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.firebase-status.online {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.firebase-status.offline {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.firebase-status.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.firebase-status.initializing {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.firebase-status .status-icon {
  display: inline-block;
  animation: pulse 2s infinite;
}

.firebase-status.loading .status-icon {
  animation: spin 1s infinite linear;
}

.firebase-status.online svg {
  animation: fadeInOut 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Dark theme support */
body.dark-theme .firebase-status.online {
  background-color: #1e5631;
  color: #a6d9a3;
  border-color: #40916c;
}

body.dark-theme .firebase-status.offline {
  background-color: #664d03;
  color: #ffc107;
  border-color: #a68103;
}

body.dark-theme .firebase-status.error {
  background-color: #5a1e1e;
  color: #f8a5a5;
  border-color: #8b3a3a;
}

body.dark-theme .firebase-status.initializing {
  background-color: #1a4d5a;
  color: #4db8d1;
  border-color: #2a7a8c;
}
`;

// Export styles as constant for documentation
export const FirebaseStatusStylesDoc = FirebaseStatusStyles;
