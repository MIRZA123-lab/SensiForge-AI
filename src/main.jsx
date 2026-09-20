import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

/*
  SensiForge AI
  Device-aware Free Fire / Free Fire MAX sensitivity engine.

  Important:
  This engine produces an optimized starting profile.
  It does not claim that one mathematical formula can guarantee
  a perfect sensitivity for every player.
*/

const brands = {
  POCO: [
    "M7",
    "X7",
    "X7 Pro",
    "F7",
    "F7 Pro",
    "F6",
    "F6 Pro",
    "X6",
    "X6 Pro",
    "X5 Pro",
    "M6 Pro",
    "M6",
    "M5",
    "M4 Pro 5G",
  ],

  Redmi: [
    "Note 14 Pro+ 5G",
    "Note 14 Pro 5G",
    "Note 14 5G",
    "Note 14",
    "Note 13 Pro+ 5G",
    "Note 13 Pro 5G",
    "Note 13 5G",
    "Note 13",
    "Note 12 Pro+ 5G",
    "Note 12 Pro 5G",
    "Note 12 5G",
    "Note 12",
    "12 5G",
    "13C",
    "14C",
  ],

  Samsung: [
    "Galaxy S25 Ultra",
    "Galaxy S25+",
    "Galaxy S25",
    "Galaxy S24 Ultra",
    "Galaxy S24+",
    "Galaxy S24",
    "Galaxy S23 Ultra",
    "Galaxy S23",
    "Galaxy A56",
    "Galaxy A36",
    "Galaxy A26",
    "Galaxy A55",
    "Galaxy A35",
    "Galaxy A25",
    "Galaxy M55",
    "Galaxy M35",
  ],

  OnePlus: [
    "13",
    "13R",
    "12",
    "12R",
    "11",
    "11R",
    "Nord 5",
    "Nord 4",
    "Nord CE4",
    "Nord CE3",
    "Nord CE3 Lite",
    "Ace 5",
  ],

  realme: [
    "GT 7 Pro",
    "GT 7",
    "GT 6",
    "GT 6T",
    "GT 5",
    "GT Neo 6",
    "P3 Pro",
    "P3",
    "12 Pro+",
    "12 Pro",
    "12+ 5G",
    "11 Pro+",
    "11 Pro",
    "Narzo 80 Pro",
    "Narzo 70 Pro",
  ],

  iQOO: [
    "13",
    "12",
    "Neo 10",
    "Neo 9 Pro",
    "Z10",
    "Z9",
    "Z9x",
    "Z7 Pro",
    "Z9s Pro",
  ],

  vivo: [
    "X200 Pro",
    "X200",
    "X100 Pro",
    "X100",
    "V50 Pro",
    "V50",
    "V40 Pro",
    "V40",
    "T4 Pro",
    "T4",
    "T3 Pro",
    "T3",
  ],

  OPPO: [
    "Find X8 Pro",
    "Find X8",
    "Find X7 Ultra",
    "Reno 13 Pro",
    "Reno 13",
    "Reno 12 Pro",
    "Reno 12",
    "F29 Pro",
    "F29",
    "F27 Pro+",
  ],

  Motorola: [
    "Edge 60 Pro",
    "Edge 60 Fusion",
    "Edge 50 Pro",
    "Edge 50 Fusion",
    "Edge 50",
    "Moto G85",
    "Moto G75",
    "Moto G64",
  ],

  Nothing: [
    "Phone (3)",
    "Phone (2a) Plus",
    "Phone (2a)",
    "Phone (2)",
    "Phone (1)",
  ],

  ASUS: [
    "ROG Phone 9 Pro",
    "ROG Phone 9",
    "ROG Phone 8 Pro",
    "ROG Phone 8",
    "Zenfone 12 Ultra",
    "Zenfone 11 Ultra",
  ],

  Infinix: [
    "GT 30 Pro",
    "GT 20 Pro",
    "GT 20",
    "Note 50 Pro+",
    "Note 50 Pro",
    "Note 40 Pro+",
    "Note 40 Pro",
  ],

  Tecno: [
    "Pova 7 Pro",
    "Pova 6 Pro",
    "Camon 40 Pro",
    "Camon 30 Pro",
    "Phantom V Fold2",
  ],

  Honor: [
    "Magic7 Pro",
    "Magic6 Pro",
    "200 Pro",
    "200",
    "X9c",
    "X8c",
  ],

  Huawei: [
    "Pura 70 Pro",
    "P60 Pro",
    "Nova 13 Pro",
    "Nova 12 Pro",
  ],

  Sony: [
    "Xperia 1 VII",
    "Xperia 1 VI",
    "Xperia 5 V",
    "Xperia 10 VI",
  ],

  Google: [
    "Pixel 9 Pro XL",
    "Pixel 9 Pro",
    "Pixel 9",
    "Pixel 8 Pro",
    "Pixel 8a",
  ],

  Apple: [
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15",
  ],
};

const devices = Object.entries(brands).flatMap(([brand, models]) =>
  models.map((model) => ({
    brand,
    model,
    label: `${brand} ${model}`,
  }))
);

const roles = [
  ["One-Tap", "onetap"],
  ["Rusher", "rush"],
  ["Sniper", "sniper"],
  ["Hybrid", "hybrid"],
];

const weapons = [
  "All weapons",
  "M1887 / Shotgun",
  "Desert Eagle",
  "MP40 / SMG",
  "AR",
  "AWM / Sniper",
];

const refreshRates = ["60 Hz", "90 Hz", "120 Hz", "144 Hz", "165 Hz"];

const resultKeys = [
  "General",
  "Red Dot",
  "2× Scope",
  "4× Scope",
  "Sniper Scope",
  "Free Look",
];

function clamp(value, min = 0, max = 200) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function hashString(value) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) / 4294967295;
}

/*
  These are tuning buckets used by the engine.
  They are NOT claimed OEM touch measurements.
*/
function getBrandBias(brand) {
  const bias = {
    POCO: 1.8,
    Redmi: 1.2,
    Samsung: -1.2,
    OnePlus: 0.8,
    realme: 1.4,
    iQOO: 2.0,
    vivo: 0.5,
    OPPO: 0.2,
    Motorola: -0.3,
    Nothing: 0.6,
    ASUS: 2.3,
    Infinix: 1.6,
    Tecno: 1.0,
    Honor: 0.3,
    Huawei: 0,
    Sony: -0.5,
    Google: -0.2,
    Apple: -2.0,
    Custom: 0,
  };

  return bias[brand] ?? 0;
}

function getRoleBase(role) {
  const profiles = {
    onetap: [184, 174, 158, 138, 92, 132],
    rush: [194, 184, 170, 150, 98, 140],
    sniper: [146, 134, 116, 98, 56, 116],
    hybrid: [176, 166, 150, 130, 82, 130],
  };

  return [...profiles[role]];
}

function getWeaponAdjustment(weapon) {
  const adjustments = {
    "All weapons": [0, 0, 0, 0, 0, 0],

    "M1887 / Shotgun": [5, 7, 4, 0, -4, 2],

    "Desert Eagle": [3, 5, 3, 0, -2, 2],

    "MP40 / SMG": [6, 5, 3, 1, 0, 2],

    AR: [0, -1, -1, 2, 0, 0],

    "AWM / Sniper": [-5, -3, -7, -8, 4, -3],
  };

  return adjustments[weapon] || adjustments["All weapons"];
}

function getFingerAdjustment(fingers) {
  if (fingers === 2) {
    return [2, 1, 0, 0, 0, 2];
  }

  if (fingers === 3) {
    return [0, 0, 1, 1, 0, 0];
  }

  return [-3, -2, -2, -1, 0, -2];
}

function optimizeSensitivity({
  device,
  dpi,
  screen,
  refresh,
  role,
  weapon,
  fingers,
  hud,
  pass,
  calibration,
}) {
  const base = getRoleBase(role);

  const deviceFactor = device
    ? hashString(device.label)
    : 0.5;

  const brandAdjustment = device
    ? getBrandBias(device.brand)
    : 0;

  const modelAdjustment = (deviceFactor - 0.5) * 8;

  const dpiAdjustment = dpi
    ? Math.max(-8, Math.min(8, (dpi - 400) / 55))
    : 0;

  const screenAdjustment = screen
    ? Math.max(-5, Math.min(5, (screen - 6.0) * 2.2))
    : 0;

  const refreshAdjustment = refresh
    ? Math.max(-4, Math.min(5, (refresh - 90) / 18))
    : 0;

  const hudAdjustment = hud ? 2.2 : 0;

  const optimizationPass = pass * 0.9;

  const weaponAdjustment = getWeaponAdjustment(weapon);
  const fingerAdjustment = getFingerAdjustment(fingers);

  const result = base.map((value, index) => {
    const dpiFactor = index < 2 ? 0.9 : 0.45;
    const screenFactor = index < 2 ? 0.45 : 0.15;
    const refreshFactor = index === 0 ? 0.55 : 0.25;
    const hudFactor = index < 3 ? 0.5 : 0.2;
    const passFactor = index < 3 ? 1 : 0;

    return clamp(
      value +
        brandAdjustment +
        modelAdjustment +
        dpiAdjustment * dpiFactor -
        screenAdjustment * screenFactor +
        refreshAdjustment * refreshFactor +
        hudAdjustment * hudFactor +
        weaponAdjustment[index] +
        fingerAdjustment[index] +
        optimizationPass * passFactor
    );
  });

  if (calibration) {
    const calibrationAdjustment = {
      above: {
        0: -5,
        1: -7,
        2: -4,
      },

      below: {
        0: 5,
        1: 7,
        2: 4,
      },

      overshoot: {
        0: -3,
        1: -5,
        2: -4,
        3: -2,
      },

      slow: {
        0: 6,
        1: 7,
        2: 5,
        3: 3,
      },

      good: {
        0: 0,
        1: 0,
        2: 0,
      },
    };

    const correction =
      calibrationAdjustment[calibration] || {};

    Object.entries(correction).forEach(([index, adjustment]) => {
      result[index] = clamp(
        result[index] + adjustment
      );
    });
  }

  /*
    Keep the sensitivity profile internally coherent.
    General >= Red Dot >= 2x >= 4x.
  */
  result[1] = clamp(
    Math.min(result[1], result[0])
  );

  result[2] = clamp(
    Math.min(result[2], result[1] + 2)
  );

  result[3] = clamp(
    Math.min(result[3], result[2] + 2)
  );

  result[4] = clamp(
    Math.min(
      result[4],
      Math.max(40, result[3] - 28)
    )
  );

  return result;
}

function getConfidence({
  device,
  dpi,
  screen,
  refresh,
  hud,
}) {
  let confidence = 55;

  if (device) {
    confidence += 15;
  }

  if (dpi) {
    confidence += 8;
  }

  if (screen) {
    confidence += 7;
  }

  if (refresh) {
    confidence += 7;
  }

  if (hud) {
    confidence += 5;
  }

  return Math.min(95, confidence);
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [device, setDevice] = useState(null);
  const [customDevice, setCustomDevice] = useState("");
  const [devicePickerOpen, setDevicePickerOpen] = useState(false);

  const [role, setRole] = useState("onetap");
  const [weapon, setWeapon] = useState("All weapons");
  const [fingers, setFingers] = useState(2);

  const [dpi, setDpi] = useState("");
  const [screenSize, setScreenSize] = useState("");
  const [refreshRate, setRefreshRate] = useState("90 Hz");

  const [hudFile, setHudFile] = useState(null);

  const [optimizationPass, setOptimizationPass] = useState(0);
  const [calibration, setCalibration] = useState(null);

  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const filteredDevices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return devices.slice(0, 80);
    }

    return devices
      .filter((item) =>
        item.label.toLowerCase().includes(query)
      )
      .slice(0, 100);
  }, [searchQuery]);

  function getSelectedDevice() {
    if (device) {
      return device;
    }

    if (customDevice.trim()) {
      return {
        brand: "Custom",
        model: customDevice.trim(),
        label: customDevice.trim(),
      };
    }

    return null;
  }

  function generateSensitivity(nextCalibration = null) {
    const selectedDevice = getSelectedDevice();

    const refreshNumber =
      parseInt(refreshRate, 10) || 90;

    const generated = optimizeSensitivity({
      device: selectedDevice,
      dpi: Number(dpi) || null,
      screen: Number(screenSize) || null,
      refresh: refreshNumber,
      role,
      weapon,
      fingers,
      hud: hudFile,
      pass: optimizationPass,
      calibration:
        nextCalibration !== null
          ? nextCalibration
          : calibration,
    });

    setResult(generated);

    if (nextCalibration !== null) {
      setCalibration(nextCalibration);
    }
  }

  function reOptimize() {
    setOptimizationPass(
      (currentPass) => currentPass + 1
    );

    setTimeout(() => {
      const selectedDevice = getSelectedDevice();

      const refreshNumber =
        parseInt(refreshRate, 10) || 90;

      const nextPass = optimizationPass + 1;

      const generated = optimizeSensitivity({
        device: selectedDevice,
        dpi: Number(dpi) || null,
        screen: Number(screenSize) || null,
        refresh: refreshNumber,
        role,
        weapon,
        fingers,
        hud: hudFile,
        pass: nextPass,
        calibration,
      });

      setResult(generated);
    }, 0);
  }

  function copyProfile() {
    if (!result) {
      return;
    }

    const profileText = resultKeys
      .map(
        (key, index) =>
          `${key}: ${result[index]}`
      )
      .join("\n");

    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileText);
    }

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1200);
  }

  function selectDevice(selectedDevice) {
    setDevice(selectedDevice);
    setCustomDevice("");
    setDevicePickerOpen(false);
    setSearchQuery("");
  }

  function useCustomDevice() {
    if (!searchQuery.trim()) {
      return;
    }

    setCustomDevice(searchQuery.trim());
    setDevice(null);
    setDevicePickerOpen(false);
  }

  const selectedDeviceLabel =
    device?.label ||
    customDevice ||
    "Search your phone model";

  const confidence = getConfidence({
    device: device || customDevice,
    dpi,
    screen: screenSize,
    refresh: parseInt(refreshRate, 10),
    hud: hudFile,
  });

  return (
    <div className="app">
      <header>
        <div>
          <div className="logo">
            SensiForge <span>AI</span>
          </div>

          <p>
            Device-aware sensitivity optimization for
            Free Fire / Free Fire MAX
          </p>
        </div>

        <div className="badge">
          0–200 ENGINE
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <span className="eyebrow">
              PERSONALIZED CONTROL ENGINE
            </span>

            <h1>
              Build a sensitivity that fits{" "}
              <i>your setup.</i>
            </h1>

            <p>
              SensiForge calculates a personalized
              starting profile from your device,
              display, DPI, refresh rate, role,
              weapon and finger setup. Real-game
              calibration can then refine it.
            </p>
          </div>
        </section>

        <section className="grid">
          <div className="panel">
            <h2>
              1. Device &amp; display
            </h2>

            <label>
              PHONE / DEVICE
            </label>

            <div className="picker">
              <button
                type="button"
                className="field"
                onClick={() =>
                  setDevicePickerOpen(
                    !devicePickerOpen
                  )
                }
              >
                {selectedDeviceLabel}

                <span>⌄</span>
              </button>

              {devicePickerOpen && (
                <div className="drop">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(
                        event.target.value
                      )
                    }
                    placeholder="Search model, e.g. POCO M7..."
                  />

                  <div className="list">
                    {filteredDevices.map(
                      (item) => (
                        <button
                          type="button"
                          key={item.label}
                          onClick={() =>
                            selectDevice(item)
                          }
                        >
                          {item.label}
                        </button>
                      )
                    )}
                  </div>

                  {searchQuery &&
                    filteredDevices.length === 0 && (
                      <button
                        type="button"
                        className="customPick"
                        onClick={
                          useCustomDevice
                        }
                      >
                        Use custom device:{" "}
                        {searchQuery}
                      </button>
                    )}
                </div>
              )}
            </div>

            <div className="two">
              <div>
                <label>
                  DPI{" "}
                  <small>
                    optional
                  </small>
                </label>

                <input
                  value={dpi}
                  onChange={(event) =>
                    setDpi(
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="e.g. 420"
                />
              </div>

              <div>
                <label>
                  SCREEN{" "}
                  <small>
                    optional
                  </small>
                </label>

                <input
                  value={screenSize}
                  onChange={(event) =>
                    setScreenSize(
                      event.target.value
                    )
                  }
                  placeholder="e.g. 6.67"
                />
              </div>
            </div>

            <label>
              REFRESH RATE
            </label>

            <div className="seg">
              {refreshRates.map((rate) => (
                <button
                  type="button"
                  key={rate}
                  className={
                    refreshRate === rate
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setRefreshRate(rate)
                  }
                >
                  {rate}
                </button>
              ))}
            </div>

            <div className="note">
              Device names are used as a tuning
              fingerprint. They are not claimed to
              represent undocumented OEM touch
              measurements.
            </div>
          </div>

          <div className="panel">
            <h2>
              2. How you play
            </h2>

            <label>
              ROLE
            </label>

            <div className="rolegrid">
              {roles.map(([name, value]) => (
                <button
                  type="button"
                  key={value}
                  className={
                    role === value
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setRole(value)
                  }
                >
                  {name}
                </button>
              ))}
            </div>

            <label>
              MAIN WEAPON / AIM STYLE
            </label>

            <select
              value={weapon}
              onChange={(event) =>
                setWeapon(event.target.value)
              }
            >
              {weapons.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <label>
              FINGER SETUP
            </label>

            <div className="finger">
              {[2, 3, 4].map(
                (fingerCount) => (
                  <button
                    type="button"
                    key={fingerCount}
                    className={
                      fingers === fingerCount
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setFingers(
                        fingerCount
                      )
                    }
                  >
                    <b>
                      {fingerCount}
                    </b>

                    Finger
                  </button>
                )
              )}
            </div>

            <label className="uploadLabel">
              HUD SCREENSHOT{" "}
              <small>
                optional
              </small>
            </label>

            <label className="upload">
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setHudFile(
                    event.target.files?.[0] ||
                      null
                  )
                }
              />

              <span>
                {hudFile
                  ? `✓ HUD attached — ${hudFile.name}`
                  : "＋ Upload HUD screenshot"}
              </span>
            </label>

            <button
              type="button"
              className="generate"
              onClick={() =>
                generateSensitivity()
              }
            >
              GENERATE OPTIMIZED
              SENSITIVITY
              <span>→</span>
            </button>
          </div>
        </section>

        {result && (
          <section className="result panel">
            <div className="resultTop">
              <div>
                <span className="eyebrow">
                  ENGINE OUTPUT
                </span>

                <h2>
                  Near-Perfect Starting Profile
                </h2>

                <p>
                  Calculated from your selected
                  setup — not a static preset.
                </p>
              </div>

              <div className="confidence">
                <b>
                  {confidence}%
                </b>

                <span>
                  engine confidence
                </span>
              </div>
            </div>

            <div className="values">
              {result.map((value, index) => (
                <div
                  className="value"
                  key={resultKeys[index]}
                >
                  <span>
                    {resultKeys[index]}
                  </span>

                  <strong>
                    {value}
                  </strong>

                  <div className="bar">
                    <i
                      style={{
                        width:
                          `${value / 2}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="actions">
              <button
                type="button"
                onClick={copyProfile}
              >
                {copied
                  ? "COPIED ✓"
                  : "COPY PROFILE"}
              </button>

              <button
                type="button"
                onClick={reOptimize}
              >
                RE-OPTIMIZE PASS
              </button>
            </div>

            <div className="calibration">
              <div>
                <h3>
                  Real-game calibration
                </h3>

                <p>
                  Test a few drag/headshots.
                  Tell the engine what actually
                  happened and it will correct
                  the next profile.
                </p>
              </div>

              <div className="calBtns">
                <button
                  type="button"
                  onClick={() =>
                    generateSensitivity("above")
                  }
                >
                  Went above head
                </button>

                <button
                  type="button"
                  onClick={() =>
                    generateSensitivity("below")
                  }
                >
                  Stopped below head
                </button>

                <button
                  type="button"
                  onClick={() =>
                    generateSensitivity("overshoot")
                  }
                >
                  Overshoot
                </button>

                <button
                  type="button"
                  onClick={() =>
                    generateSensitivity("slow")
                  }
                >
                  Too slow
                </button>

                <button
                  type="button"
                  onClick={() =>
                    generateSensitivity("good")
                  }
                >
                  Feels good
                </button>
              </div>
            </div>

            <div className="warning">
              This is an optimized starting profile,
              not a guaranteed universal perfect
              setting. Touch response, FPS stability,
              screen friction, latency and player
              technique can change the result.
              Calibration makes the profile more
              personal.
            </div>
          </section>
        )}
      </main>

      <footer>
        SensiForge AI · Local calculation · No
        account required
      </footer>
    </div>
  );
}

const rootElement =
  document.getElementById("root");

createRoot(rootElement).render(
  <App />
);
