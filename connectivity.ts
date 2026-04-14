// Connectivity detection and management

export type ConnectionQuality = 'high' | 'medium' | 'low' | 'offline';
export type ConsultationMode = 'video' | 'audio' | 'chat';

export interface ConnectivityState {
  isOnline: boolean;
  quality: ConnectionQuality;
  speed: number; // simulated Mbps
  mode: ConsultationMode;
  latency: number; // ms
}

export function getRecommendedMode(quality: ConnectionQuality): ConsultationMode {
  switch (quality) {
    case 'high': return 'video';
    case 'medium': return 'audio';
    case 'low':
    case 'offline': return 'chat';
  }
}

export function getConnectivityLabel(quality: ConnectionQuality): string {
  switch (quality) {
    case 'high': return 'Excellent';
    case 'medium': return 'Moderate';
    case 'low': return 'Weak';
    case 'offline': return 'Offline';
  }
}

export function getConnectivityColor(quality: ConnectionQuality): string {
  switch (quality) {
    case 'high': return '#00D4AA';
    case 'medium': return '#FDCB6E';
    case 'low': return '#FF9F43';
    case 'offline': return '#FF6B6B';
  }
}

// Simulate connectivity detection
export function simulateConnectivity(offlineMode: boolean): ConnectivityState {
  if (offlineMode) {
    return {
      isOnline: false,
      quality: 'offline',
      speed: 0,
      mode: 'chat',
      latency: -1,
    };
  }

  // Simulate realistic rural connectivity
  const rand = Math.random();
  let quality: ConnectionQuality;
  let speed: number;
  let latency: number;

  if (rand < 0.3) {
    quality = 'high';
    speed = 5 + Math.random() * 15; // 5-20 Mbps
    latency = 30 + Math.random() * 70;
  } else if (rand < 0.6) {
    quality = 'medium';
    speed = 1 + Math.random() * 4; // 1-5 Mbps
    latency = 100 + Math.random() * 200;
  } else {
    quality = 'low';
    speed = 0.1 + Math.random() * 0.9; // 0.1-1 Mbps
    latency = 300 + Math.random() * 700;
  }

  return {
    isOnline: true,
    quality,
    speed,
    mode: getRecommendedMode(quality),
    latency,
  };
}

// Consultation mode descriptions
export function getModeDescription(mode: ConsultationMode): { icon: string; label: string; desc: string } {
  switch (mode) {
    case 'video':
      return { icon: '📹', label: 'Video Call', desc: 'Full video consultation with doctor' };
    case 'audio':
      return { icon: '📞', label: 'Audio Call', desc: 'Voice-only call to save data' };
    case 'chat':
      return { icon: '💬', label: 'Chat + Video Message', desc: 'Text chat with recorded video messages' };
  }
}
