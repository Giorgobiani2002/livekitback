import { NoiseCancellationOptions } from '@livekit/rtc-node';

declare function NoiseCancellation(): NoiseCancellationOptions;
declare function BackgroundVoiceCancellation(): NoiseCancellationOptions;
declare function TelephonyBackgroundVoiceCancellation(): NoiseCancellationOptions;

export { BackgroundVoiceCancellation, NoiseCancellation, TelephonyBackgroundVoiceCancellation };
