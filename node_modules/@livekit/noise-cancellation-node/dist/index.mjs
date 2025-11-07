var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/index.ts
import path from "path";
import fs from "fs";
import { createRequire } from "module";
import { AudioFilter } from "@livekit/rtc-node";
var MODULE_ID = "livekit.plugins.noise_cancellation";
var _loaded = false;
function getPlatformResources() {
  const platform = process.platform;
  const arch = process.arch;
  if (platform === "linux") {
    if (arch === "x64") {
      return "@livekit/noise-cancellation-linux-x64";
    } else if (arch === "arm64") {
      return "@livekit/noise-cancellation-linux-arm64";
    }
  } else if (platform === "darwin") {
    if (arch === "arm64") {
      return "@livekit/noise-cancellation-darwin-arm64";
    } else if (arch === "x64") {
      return "@livekit/noise-cancellation-darwin-x64";
    }
  } else if (platform === "win32" && arch === "x64") {
    return "@livekit/noise-cancellation-win32-x64";
  }
  throw new Error(`Unsupported platform: ${platform}-${arch}`);
}
function getResourceDir() {
  try {
    const platformPackage = getPlatformResources();
    let pkgPath;
    if (typeof import.meta !== "undefined" && import.meta && import.meta.url) {
      const require2 = createRequire(import.meta.url);
      pkgPath = path.dirname(require2.resolve(`${platformPackage}/package.json`));
    } else {
      pkgPath = path.dirname(__require.resolve(`${platformPackage}/package.json`));
    }
    const resourcePath = path.join(pkgPath, "resources");
    return resourcePath;
  } catch (e) {
    return path.join(__dirname, "..", "resources");
  }
}
function getDylibPath(name) {
  const resourcesDir = getResourceDir();
  let ext;
  if (process.platform === "linux") {
    ext = ".so";
  } else if (process.platform === "darwin") {
    ext = ".dylib";
  } else if (process.platform === "win32") {
    ext = ".dll";
  } else {
    throw new Error(`Unsupported platform: ${process.platform}`);
  }
  const dylibPath = path.join(resourcesDir, `${name}${ext}`);
  if (!fs.existsSync(dylibPath)) {
    throw new Error(`Library not found: ${dylibPath}`);
  }
  return dylibPath;
}
function getResourcePath(name) {
  const resourcesDir = getResourceDir();
  const resourcePath = path.join(resourcesDir, name);
  if (!fs.existsSync(resourcePath)) {
    throw new Error(`Resource not found: ${resourcePath}`);
  }
  return resourcePath;
}
function pluginPath() {
  return getDylibPath("liblivekit_nc_plugin");
}
function dependenciesPath() {
  return [];
}
function modelPath(model) {
  switch (model) {
    case "nc":
      return getResourcePath("c8.f.s.026300-1.0.0_3.1.kef");
    case "bvc":
      return getResourcePath("hs.c6.f.m.75df8f.kef");
    case "bvct":
      return getResourcePath("inb.bvc.hs.c6.w.s.23cdb3.kef");
    default:
      throw new Error(`Unsupported model: ${model}`);
  }
}
function NoiseCancellation() {
  return {
    moduleId: MODULE_ID,
    options: {
      modelPath: modelPath("nc")
    }
  };
}
function BackgroundVoiceCancellation() {
  return {
    moduleId: MODULE_ID,
    options: {
      modelPath: modelPath("bvc")
    }
  };
}
function TelephonyBackgroundVoiceCancellation() {
  return {
    moduleId: MODULE_ID,
    options: {
      modelPath: modelPath("bvct")
    }
  };
}
function load() {
  if (!_loaded) {
    _loaded = true;
    if (process.env.LK_OVERRIDE_OPENBLAS_NUM_THREADS === void 0) {
      process.env.OPENBLAS_NUM_THREADS = "1";
    }
    try {
      new AudioFilter(
        MODULE_ID,
        pluginPath(),
        dependenciesPath()
      );
    } catch (error) {
      console.error("Error loading noise cancellation plugin:", error);
    }
  }
}
load();
export {
  BackgroundVoiceCancellation,
  NoiseCancellation,
  TelephonyBackgroundVoiceCancellation
};
