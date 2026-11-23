/**
 * Audio & Microphone Permission and Device Management Service
 * Provides robust permission checking, graceful error recovery,
 * and clear user-facing guidance for Web Speech Recognition.
 */

export interface MicPermissionResult {
  success: boolean;
  message?: string;
  isPermissionBlocked?: boolean;
}

/**
 * Checks existing browser microphone permission state without actively prompting.
 */
export async function queryMicrophonePermission(): Promise<'granted' | 'prompt' | 'denied' | 'unsupported'> {
  if (typeof navigator === 'undefined') return 'unsupported';

  try {
    if (navigator.permissions && navigator.permissions.query) {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return permissionStatus.state;
    }
  } catch (_) {
    // navigator.permissions.query for 'microphone' is not supported in all browsers (e.g. Safari / Firefox)
  }

  return 'prompt';
}

/**
 * Robust microphone hardware & permission verification.
 * Safely requests media stream with getUserMedia, releases tracks immediately,
 * and maps all standard DOMExceptions to actionable, clear instructions.
 */
export async function verifyAndRequestMicrophone(): Promise<MicPermissionResult> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      success: false,
      message: 'Microphone is unavailable in this environment.',
    };
  }

  // 1. Check if mediaDevices API is supported
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    // If on insecure HTTP (not localhost or HTTPS), getUserMedia is disabled by browser security
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return {
        success: false,
        message: 'Microphone requires a secure HTTPS connection. Please use HTTPS or localhost.',
      };
    }

    return {
      success: false,
      message: 'Your browser does not support audio recording. Please update or use Chrome, Edge, or Safari.',
    };
  }

  // 2. Query permission state if supported
  const currentStatus = await queryMicrophonePermission();
  if (currentStatus === 'denied') {
    return {
      success: false,
      isPermissionBlocked: true,
      message: 'Microphone access is blocked. Please click the lock or settings icon in your browser address bar to allow microphone permissions.',
    };
  }

  // 3. Request audio stream safely
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // Successfully acquired access! Immediately stop and release hardware tracks
    // so SpeechRecognition or subsequent AudioContext can claim the device without conflicts.
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (_) {}
    });

    return { success: true };
  } catch (error: any) {
    const errorName = error?.name || '';
    const errorMsg = error?.message || '';

    if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError' || errorMsg.includes('Permission denied')) {
      return {
        success: false,
        isPermissionBlocked: true,
        message: 'Microphone permission was denied. Please allow microphone access in your browser settings to speak.',
      };
    }

    if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError' || errorMsg.includes('Requested device not found')) {
      return {
        success: false,
        message: 'No microphone found on your device. Please connect an audio input device or type your query.',
      };
    }

    if (errorName === 'NotReadableError' || errorName === 'TrackStartError' || errorMsg.includes('Could not start audio source')) {
      return {
        success: false,
        message: 'Microphone is in use by another application or tab. Please close other voice apps and try again.',
      };
    }

    if (errorName === 'OverconstrainedError') {
      return {
        success: false,
        message: 'Microphone settings could not be satisfied by your device.',
      };
    }

    if (errorName === 'SecurityError') {
      return {
        success: false,
        isPermissionBlocked: true,
        message: 'Microphone access is restricted by security policy or iframe permissions.',
      };
    }

    return {
      success: false,
      message: `Unable to access microphone (${errorName || 'Check permissions'}). Please check browser settings.`,
    };
  }
}

/**
 * Returns SpeechRecognition constructor if available
 */
export function getSpeechRecognitionConstructor(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

/**
 * Human-friendly error translation for SpeechRecognition error events
 */
export function translateSpeechRecognitionError(errorCode: string): { message: string; isBlocked?: boolean } {
  switch (errorCode) {
    case 'not-allowed':
    case 'service-not-allowed':
      return {
        message: 'Microphone permission is blocked. Click the address bar icon to allow microphone access.',
        isBlocked: true,
      };
    case 'audio-capture':
      return {
        message: 'Microphone capture failed. Check that your microphone is plugged in and unmuted.',
      };
    case 'network':
      return {
        message: 'Speech recognition network error. Please verify your internet connection.',
      };
    case 'no-speech':
      return {
        message: 'No speech was detected. Tap mic again and speak clearly.',
      };
    case 'bad-grammar':
      return {
        message: 'Speech recognition grammar error occurred.',
      };
    case 'language-not-supported':
      return {
        message: 'Selected language is not supported by your browser speech engine.',
      };
    case 'aborted':
      return {
        message: '',
      };
    default:
      return {
        message: `Voice recognition issue (${errorCode}). Please try again or type below.`,
      };
  }
}
