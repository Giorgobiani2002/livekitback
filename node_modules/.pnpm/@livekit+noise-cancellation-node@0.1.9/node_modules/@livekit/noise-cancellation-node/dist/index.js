"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BackgroundVoiceCancellation: () => BackgroundVoiceCancellation,
  NoiseCancellation: () => NoiseCancellation,
  TelephonyBackgroundVoiceCancellation: () => TelephonyBackgroundVoiceCancellation
});
module.exports = __toCommonJS(index_exports);
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_module = require("module");
var import_rtc_node = require("@livekit/rtc-node");
var import_meta = {};
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
    if (typeof import_meta !== "undefined" && import_meta && import_meta.url) {
      const require2 = (0, import_module.createRequire)(import_meta.url);
      pkgPath = import_path.default.dirname(require2.resolve(`${platformPackage}/package.json`));
    } else {
      pkgPath = import_path.default.dirname(require.resolve(`${platformPackage}/package.json`));
    }
    const resourcePath = import_path.default.join(pkgPath, "resources");
    return resourcePath;
  } catch (e) {
    return import_path.default.join(__dirname, "..", "resources");
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
  const dylibPath = import_path.default.join(resourcesDir, `${name}${ext}`);
  if (!import_fs.default.existsSync(dylibPath)) {
    throw new Error(`Library not found: ${dylibPath}`);
  }
  return dylibPath;
}
function getResourcePath(name) {
  const resourcesDir = getResourceDir();
  const resourcePath = import_path.default.join(resourcesDir, name);
  if (!import_fs.default.existsSync(resourcePath)) {
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
      new import_rtc_node.AudioFilter(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BackgroundVoiceCancellation,
  NoiseCancellation,
  TelephonyBackgroundVoiceCancellation
});
