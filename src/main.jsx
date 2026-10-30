import React, { useEffect, useMemo, useState } from "react";
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

const ROLE_CURVES={onetap:[178,168,150,128,78,112],rush:[188,178,158,136,82,122],sniper:[150,138,118,96,58,105],hybrid:[170,158,142,122,76,115]};
const WEAPON_CURVES={"All weapons":[0,0,0,0,0,0],"M1887 / Shotgun":[5,7,2,-8,-12,0],"Desert Eagle":[0,5,1,-5,-8,0],"MP40 / SMG":[4,3,0,-4,-8,0],AR:[-2,-2,2,4,-2,0],"AWM / Sniper":[-8,-6,-7,-8,8,-4],"Woodpecker":[-2,-2,1,4,-5,0],"SCAR / XM8":[-1,-1,2,3,-2,0],"M4A1 / AK":[-1,-1,2,3,-2,0]};
function optimizeSensitivity({dpi,screen,resolutionWidth,resolutionHeight,refresh,fps,touchRate,role,weapon,fingers,fireButton,aimPrecision,calibration}) {
  // Six global in-game sliders. Hardware terms are deliberately bounded:
  // they tune the starting point, while training-ground feedback remains decisive.
  const diagonalPixels = resolutionWidth && resolutionHeight
    ? Math.hypot(resolutionWidth, resolutionHeight) : null;
  const ppi = diagonalPixels && screen ? diagonalPixels / screen : null;
  const densityTerm = dpi ? Math.max(-2, Math.min(2, (dpi - 420) / 100)) : 0;
  const sizeTerm = screen ? Math.max(-3, Math.min(3, (6.8 - screen) * 1.35)) : 0;
  const ppiTerm = ppi ? Math.max(-2.5, Math.min(2.5, (ppi - 350) / 75)) : 0;
  const fpsTerm = fps ? Math.max(-4, Math.min(4, (fps - 60) / 15)) : 0;
  const touchTerm = touchRate ? Math.max(-3, Math.min(3, (touchRate - 120) / 80)) : 0;
  const refreshTerm = refresh ? Math.max(-2, Math.min(2, (refresh - 60) / 45)) : 0;
  const curve = WEAPON_CURVES[weapon] || WEAPON_CURVES["All weapons"];
  const gripTerm = fingers === 2 ? 1.5 : fingers === 3 ? 0.5 : -1;
  const buttonTerm = fireButton ? Math.max(-2.5, Math.min(2.5, (fireButton - 50) / 10)) : 0;
  const precisionTerm = aimPrecision === "Precise on Scope" ? -3 : aimPrecision === "Full Control" ? 2 : 0;
  const roleCurve = ROLE_CURVES[role] || ROLE_CURVES.hybrid;

  const output = roleCurve.map((base, index) => {
    const cameraWeight = index < 2 ? 1 : index < 4 ? 0.65 : 0.35;
    const displayAdjustment = (sizeTerm * 0.9 + ppiTerm * 0.55 + densityTerm * 0.3) * cameraWeight;
    const responseAdjustment = (fpsTerm * 0.65 + touchTerm * 0.65 + refreshTerm * 0.35) * cameraWeight;
    const gripAdjustment = gripTerm * (index < 2 ? 1 : 0.3);
    const buttonAdjustment = buttonTerm * (index < 2 ? 0.8 : 0.2);
    const precisionAdjustment = precisionTerm * (index < 2 ? 0.65 : 0.35);
    return clamp(base + curve[index] + displayAdjustment + responseAdjustment +
      gripAdjustment + buttonAdjustment + precisionAdjustment);
  });

  if (calibration) {
    const index = calibration.sliderIndex ?? 0;
    const correction = calibration.outcome === "overshoot" ? -5 :
      calibration.outcome === "undershoot" ? 5 :
      calibration.outcome === "shaky" ? -4 :
      calibration.outcome === "slow" ? 4 : 0;
    output[index] = clamp(output[index] + correction);
  }
  output[2] = Math.min(output[2], output[1] + 4);
  output[3] = Math.min(output[3], output[2] + 4);
  output[4] = Math.min(output[4], output[3] - 12);
  return output.map(value => clamp(value));
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
  const [game, setGame] = useState("Free Fire MAX");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  useEffect(() => {
    if (!loading) { setLoadingStep(0); return; }
    const stages = [1, 2, 3, 4];
    let index = 0;
    const id = window.setInterval(() => {
      index = (index + 1) % stages.length;
      setLoadingStep(stages[index]);
    }, 620);
    return () => window.clearInterval(id);
  }, [loading]);

  const [weaponMode, setWeaponMode] = useState("all");
  const [selectedWeapons, setSelectedWeapons] = useState(["M1887 / Shotgun", "Desert Eagle", "MP40 / SMG", "AR", "AWM / Sniper"]);
  const [fps,setFps]=useState("60"); const [touchRate,setTouchRate]=useState(""); const [resolutionWidth,setResolutionWidth]=useState("1080"); const [resolutionHeight,setResolutionHeight]=useState(""); const [fireButton,setFireButton]=useState("50"); const [aimPrecision,setAimPrecision]=useState("Default"); const [testSlider,setTestSlider]=useState("General");
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

  function calculateProfile(nextCalibration = null) {
    const selectedDevice = getSelectedDevice();

    const refreshNumber =
      parseInt(refreshRate, 10) || 90;

    const generated = optimizeSensitivity({
      dpi:Number(dpi)||null, screen:Number(screenSize)||null,
      resolutionWidth:Number(resolutionWidth)||null, resolutionHeight:Number(resolutionHeight)||null, refresh:refreshNumber,
      fps:Number(fps)||null, touchRate:Number(touchRate)||null,
      role,weapon,fingers,fireButton:Number(fireButton)||null,aimPrecision,
      calibration:nextCalibration?{sliderIndex:resultKeys.indexOf(testSlider),outcome:nextCalibration}:null
    });

    setResult(generated);

    if (nextCalibration !== null) {
      setCalibration(nextCalibration);
    }
  }

  function generateSensitivity(nextCalibration = null) {
    setLoading(true);
    window.setTimeout(() => {
      calculateProfile(nextCalibration);
      setLoading(false);
    }, 3100);
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

      const generated = optimizeSensitivity({dpi:Number(dpi)||null,screen:Number(screenSize)||null,resolutionWidth:Number(resolutionWidth)||null,resolutionHeight:Number(resolutionHeight)||null,refresh:refreshNumber,fps:Number(fps)||null,touchRate:Number(touchRate)||null,role,weapon,fingers,fireButton:Number(fireButton)||null,aimPrecision,calibration:null});

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
            <div className="welcomeAnime" aria-label="Welcome to SensiForge">
              <div className="welcomeLetters">
                {Array.from("WELCOME").map((letter, index) => (
                  <span key={index} style={{ "--letter-index": index }}>{letter}</span>
                ))}
              </div>
              <span className="welcomeSubline">THE FORGE IS READY</span>
            </div>
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

        <section className="panel gamePanel">
          <div>
            <span className="eyebrow">01 / SELECT YOUR GAME</span>
            <h2>Which version do you play?</h2>
            <p className="sectionHint">Choose the game version before building your profile.</p>
          </div>
          <div className="gameChoices">
            {["Free Fire India", "Free Fire MAX"].map((item) => (
              <button type="button" key={item}
                className={game === item ? "gameChoice selected" : "gameChoice"}
                onClick={() => { setGame(item); setResult(null); }}>
                <span className="gameIcon">✦</span>
                <span><b>{item}</b><small>{item === "Free Fire India" ? "India version" : "Enhanced graphics version"}</small></span>
                <i>{game === item ? "✓" : "+"}</i>
              </button>
            ))}
          </div>
        </section>

        <section className="grid">
          <div className="panel">
            <h2>
              2. Device &amp; display
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
                <label>DISPLAY SIZE (INCHES)</label>
                <input
                  value={screenSize}
                  onChange={(event) => setScreenSize(event.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="e.g. 6.88"
                  inputMode="decimal"
                />
              </div>
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
                <label>SCREEN RESOLUTION <small>optional</small></label>
                <input value={resolutionWidth} onChange={(e)=>setResolutionWidth(e.target.value.replace(/\D/g,""))} placeholder="e.g. 1080" />
              </div>
            </div>

            <div className="two"><div><label>RESOLUTION HEIGHT</label><input value={resolutionHeight} onChange={e=>setResolutionHeight(e.target.value.replace(/\D/g,""))} placeholder="e.g. 2400"/></div><div><label>ACTUAL GAME FPS</label><select value={fps} onChange={e=>setFps(e.target.value)}><option value="30">30 FPS</option><option value="40">40 FPS</option><option value="60">Stable 60 FPS</option><option value="90">Stable 90 FPS</option><option value="120">Stable 120 FPS</option><option value="0">Unstable / unknown</option></select></div><div><label>TOUCH SAMPLING RATE</label><select value={touchRate} onChange={e=>setTouchRate(e.target.value)}><option value="">Unknown / not measured</option><option value="60">60 Hz</option><option value="120">120 Hz</option><option value="180">180 Hz</option><option value="240">240 Hz</option><option value="360">360 Hz</option><option value="0">Unknown</option></select></div></div>
            <label>FIRE BUTTON SIZE (%)</label><input value={fireButton} onChange={e=>setFireButton(e.target.value.replace(/\D/g,""))}/>
            <label>AIM PRECISION</label><select value={aimPrecision} onChange={e=>setAimPrecision(e.target.value)}><option>Default</option><option>Precise on Scope</option><option>Full Control</option></select>
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
              3. How you play
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

            <label>WEAPON SENSITIVITY</label>
            <div className="weaponModes">
              <button type="button" className={weaponMode === "all" ? "active" : ""} onClick={() => {setWeaponMode("all"); setWeapon("All weapons");}}>All weapons</button>
              <button type="button" className={weaponMode === "individual" ? "active" : ""} onClick={() => setWeaponMode("individual")}>Choose weapons</button>
            </div>
            {weaponMode === "individual" && (
              <div className="weaponGrid">
                {weapons.filter((item) => item !== "All weapons").map((item) => (
                  <label className="weaponCheck" key={item}>
                    <input type="checkbox" checked={selectedWeapons.includes(item)}
                      onChange={(event) => setSelectedWeapons((current) => event.target.checked ? [...current, item] : current.filter((x) => x !== item))} />
                    {item}
                  </label>
                ))}
              </div>
            )}
            {weaponMode === "individual" && (
              <select value={weapon} onChange={(event) => setWeapon(event.target.value)}>
                {selectedWeapons.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            )}

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
                  Your {game} sensitivity profile
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

              <div className="calBtns"><label>TEST SLIDER<select value={testSlider} onChange={e=>setTestSlider(e.target.value)}>{resultKeys.map(k=><option key={k}>{k}</option>)}</select></label>
                <button
                  type="button"
                  onClick={() =>
                    generateSensitivity("overshoot")
                  }
                >
                  Went above head
                </button>

                <button
                  type="button"
                  onClick={() =>
                    generateSensitivity("undershoot")
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
              Why these values? General controls camera movement and fast drag turns; Red Dot and 2× guide close-to-mid-range tracking; 4× and Sniper use lower values for finer corrections; Free Look controls camera look-around. Device size, pixel density, FPS stability, refresh/touch response, finger layout, fire-button size and your selected role/weapon adjust the starting profile. These are bounded estimates, not hidden Garena measurements. Test in Training Ground and change one slider at a time. India and MAX share core gunplay, so the game selector does not add an invented sensitivity offset.
            </div>
          </section>
        )}
      </main>

      {loading && (
        <div className="loadingOverlay" role="status" aria-live="polite">
          <div className="duelScene" aria-hidden="true">
            <div className="duelMoon" />
            <div className="duelMountain duelMountainBack" />
            <div className="duelMountain duelMountainFront" />
            <div className="duelGround" />
            <div className="duelDust dustOne" /><div className="duelDust dustTwo" />
            <svg className="duelFighter fighterLeft" viewBox="0 0 260 360">
              <defs>
                <linearGradient id="warriorIvory" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e8e2d7"/><stop offset=".48" stopColor="#8f8a82"/><stop offset="1" stopColor="#27272b"/></linearGradient>
                <linearGradient id="warriorSteel" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f4eee4"/><stop offset="1" stopColor="#4b4a4b"/></linearGradient>
              </defs>
              <g stroke="#09090b" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
                <path d="M104 104 Q76 112 67 151 L48 224 Q76 250 142 241 L166 164 Q165 119 137 105Z" fill="url(#warriorIvory)"/>
                <path d="M91 119 L116 143 L143 115 L157 159 L133 188 L79 178 L67 148Z" fill="#25252a"/>
                <path d="M113 140 L137 157 L125 199 L95 184Z" fill="url(#warriorSteel)"/>
                <path d="M72 150 Q44 157 39 190 L22 224 Q36 238 53 224 L82 185" fill="#b7b0a4"/>
                <path d="M151 139 Q180 131 190 155 L222 111 L237 122 L208 184 Q191 199 166 176" fill="#d2cabe"/>
                <path d="M78 211 L59 274 L43 315 L64 322 L100 267 L119 225" fill="#3a393b"/>
                <path d="M120 229 L137 274 L160 311 L180 303 L158 250 L160 220" fill="#77716b"/>
                <path d="M42 314 L24 330 L68 332 L76 322 M158 310 L151 331 L194 329 L180 302" fill="#151518"/>
                <path d="M87 57 Q85 20 123 17 Q163 20 166 59 L151 101 L102 107Z" fill="#101013"/>
                <path d="M91 65 Q123 48 158 66 L151 88 Q122 101 96 87Z" fill="#c9c2b7"/>
                <path d="M103 74 L116 71 M136 71 L149 75" stroke="#151518" strokeWidth="5"/>
                <path d="M91 48 Q54 40 58 17 Q83 31 112 22 Q149 5 174 30 L160 48 Q124 35 91 48Z" fill="#17171b"/>
                <path d="M105 105 L141 109 L151 127 L126 143 L91 124Z" fill="#555158"/>
                <path d="M194 153 L245 65" stroke="#d8d4cd" strokeWidth="7"/>
                <path d="M186 162 L203 137" stroke="#242328" strokeWidth="12"/>
                <path d="M193 151 L245 65" stroke="#fff" strokeWidth="2"/>
                <path d="M68 165 L93 188 M151 159 L166 180 M81 226 L139 236" fill="none" stroke="#e8e1d7" strokeWidth="3"/>
                <path d="M59 272 L94 278 M133 273 L161 265" fill="none" stroke="#17171a" strokeWidth="8"/>
              </g>
              <path d="M88 99 Q48 118 18 91 Q54 99 76 75Z" fill="#151519"/>
              <path d="M145 101 Q178 112 197 94 Q176 127 150 121Z" fill="#252329"/>
            </svg>
            <svg className="duelFighter fighterRight" viewBox="0 0 260 360">
              <defs>
                <linearGradient id="warriorObsidian" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#55545b"/><stop offset=".38" stopColor="#17171d"/><stop offset="1" stopColor="#030305"/></linearGradient>
                <linearGradient id="warriorRed" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#9b2630"/><stop offset="1" stopColor="#26070d"/></linearGradient>
              </defs>
              <g stroke="#030305" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
                <path d="M104 104 Q76 112 67 151 L48 224 Q76 250 142 241 L166 164 Q165 119 137 105Z" fill="url(#warriorObsidian)"/>
                <path d="M91 119 L116 143 L143 115 L157 159 L133 188 L79 178 L67 148Z" fill="#08080c"/>
                <path d="M113 140 L137 157 L125 199 L95 184Z" fill="#292930"/>
                <path d="M72 150 Q44 157 39 190 L22 224 Q36 238 53 224 L82 185" fill="#222229"/>
                <path d="M151 139 Q180 131 190 155 L222 111 L237 122 L208 184 Q191 199 166 176" fill="#33323a"/>
                <path d="M78 211 L59 274 L43 315 L64 322 L100 267 L119 225" fill="#15151b"/>
                <path d="M120 229 L137 274 L160 311 L180 303 L158 250 L160 220" fill="#28272e"/>
                <path d="M42 314 L24 330 L68 332 L76 322 M158 310 L151 331 L194 329 L180 302" fill="#050507"/>
                <path d="M87 57 Q85 20 123 17 Q163 20 166 59 L151 101 L102 107Z" fill="#050508"/>
                <path d="M91 65 Q123 48 158 66 L151 88 Q122 101 96 87Z" fill="#77737a"/>
                <path d="M103 74 L116 71 M136 71 L149 75" stroke="#09090c" strokeWidth="5"/>
                <path d="M91 48 Q54 40 58 17 Q83 31 112 22 Q149 5 174 30 L160 48 Q124 35 91 48Z" fill="#09090d"/>
                <path d="M105 105 L141 109 L151 127 L126 143 L91 124Z" fill="url(#warriorRed)"/>
                <path d="M194 153 L245 65" stroke="#e5e0d8" strokeWidth="7"/>
                <path d="M186 162 L203 137" stroke="#101015" strokeWidth="12"/>
                <path d="M193 151 L245 65" stroke="#fff" strokeWidth="2"/>
                <path d="M68 165 L93 188 M151 159 L166 180 M81 226 L139 236" fill="none" stroke="#a43a43" strokeWidth="3"/>
                <path d="M59 272 L94 278 M133 273 L161 265" fill="none" stroke="#050508" strokeWidth="8"/>
              </g>
              <path d="M88 99 Q48 118 18 91 Q54 99 76 75Z" fill="#060609"/>
              <path d="M145 101 Q178 112 197 94 Q176 127 150 121Z" fill="#15151b"/>
            </svg>
            <svg className="duelEffects" viewBox="0 0 900 440">
              <path className="duelSlash slashRed" d="M360 178 Q450 70 548 175"/>
              <path className="duelSlash slashWhite" d="M535 245 Q445 340 345 245"/>
              <path className="duelClash" d="M410 184 L450 140 L490 184 L450 226Z"/>
              <g className="duelSparks"><path d="M450 190l-48-42m48 42 52-58m-52 58 60 34m-60-34-55 49m55-49 5-72m-5 72-10 82"/></g>
            </svg>
            <div className="duelCaption">SHADOW DUEL <span>•</span> ROUND IN PROGRESS</div>
          </div>
          <div className="loadingTitle">FORGING YOUR PROFILE</div>
          <p>{["Reading device geometry","Mapping touch response","Tuning weapon control curves","Finalizing sensitivity profile"][Math.min(3,loadingStep)]}</p>
          <div className="loadingTrack"><i /></div>
          <div className="loadingMicro">SENSIFORGE // LIVE CALCULATION</div>
        </div>
      )}
      <footer>
        SensiForge AI · On-device calculation · No account required
      </footer>
    </div>
  );
}

const rootElement =
  document.getElementById("root");

createRoot(rootElement).render(
  <App />
);
