# LiveKit Noise Cancellation Plugin for Node.js

This package provides noise cancellation capabilities for LiveKit Node.js applications.

## Installation

```bash
npm install @livekit/noise-cancellation-node
```

## Usage

```typescript
import * as LivekitNC from '@livekit/noise-cancellation-node';

// Create AudioStream with noise cancellation
const stream = new AudioStream(track, { noiseCancellation: LivekitNC.NoiseCancellation() });
```

## Options

- `NoiseCancellationC()`: Standard noise cancellation
- `BackgroundVoiceCancellation()`: Voice enhancement (background voice cancellation)
- `TelephonyBackgroundVoiceCancellation()`: Voice enhancement (background voice cancellation) for Telephony audio

## Architecture

This package uses a multi-package architecture to support platform-specific shared libraries:

- `@livekit/noise-cancellation-node` - Main package with TypeScript code
- `@livekit/noise-cancellation-darwin-arm64` - macOS ARM64 binaries and resources
- `@livekit/noise-cancellation-darwin-x64` - macOS x64 binaries and resources
- `@livekit/noise-cancellation-linux-x64` - Linux x64 binaries and resources
- `@livekit/noise-cancellation-linux-arm64` - Linux ARM64 binaries and resources
- `@livekit/noise-cancellation-win32-x64` - Windows x64 binaries and resources

The main package automatically selects and loads the appropriate platform-specific package for your system.

## Notes

If you experience crashes when using `noise_cancellation` (especially on AMD CPUs), it may be due to a failure in OpenBLAS's CPU detection. Manually setting the `OPENBLAS_CORETYPE` environment variable to a more conservative value (e.g., `Haswell`) may resolve the issue.

## License

See https://livekit.io/legal/terms-of-service