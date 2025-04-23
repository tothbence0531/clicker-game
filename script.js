const LEVELS = [
  { name: "Stone", gpc: 1, upgradeCost: 100, image: "stone.webp" },
  { name: "Coal", gpc: 4, upgradeCost: 400, image: "coal.webp" },
  { name: "Iron", gpc: 10, upgradeCost: 1_200, image: "iron.webp" },
  { name: "Redstone", gpc: 20, upgradeCost: 3_000, image: "redstone.webp" },
  { name: "Gold", gpc: 40, upgradeCost: 8_000, image: "gold.webp" },
  { name: "Emerald", gpc: 75, upgradeCost: 18_000, image: "emerald.webp" },
  { name: "Diamond", gpc: 150, upgradeCost: 40_000, image: "diamond.webp" },
];

let pickaxeUpgrade = {
  level: 0,
  gps: 4,
  cost: 50,
  costMultiplier: 1.1,
};

let gpsUpgrades = [
  { name: "background", cost: 300, gps: 5, requiredLevel: 1 },
  { name: "cow", cost: 800, gps: 12, requiredLevel: 2 },
  { name: "steve", cost: 1_500, gps: 25, requiredLevel: 3 },
  { name: "creeper", cost: 3_000, gps: 50, requiredLevel: 3 },
  { name: "singer", cost: 5_000, gps: 80, requiredLevel: 4 },
  { name: "phantom", cost: 8_000, gps: 130, requiredLevel: 4 },
  { name: "fatguy", cost: 12_000, gps: 200, requiredLevel: 5 },
  { name: "cave", cost: 18_000, gps: 300, requiredLevel: 5 },
  { name: "clock", cost: 25_000, gps: 500, requiredLevel: 6 },
  { name: "exit", cost: 35_000, gps: 1000, requiredLevel: 6 },
];

const coinsElement = $(".coins-data");
const clicker = $(".clicker-img");
const upgradeOreButton = $(".upgrade-ore");
const upgradePickaxeButton = $(".upgrade-pickaxe");
const upgradeElement = $(".upgrade");

var currentLevelIndex = 0;
var currentLevel = LEVELS[currentLevelIndex];
var gpc = currentLevel.gpc;
var coins = 0;
var gps = 0;
var audioList = [];
var intervalList = [];
var ended = false;

// INFO: EVENTS

$(document).ready(() => {
  $(".modal-wrapper").hide();
  if (localStorage.getItem("coins") == null) {
    console.log("Save not found");
    $(".save-found").css("display", "none");
  } else {
    $(".save-date").text(localStorage.getItem("save-date"));
    $(".save-level").text(localStorage.getItem("currentLevelIndex"));
    $(".save-gold").text(localStorage.getItem("coins"));
    $(".save-found").css("display", "flex");
  }
  updateUI();
  startgpsTimer();
});

$(window).resize(() => {
  if (getUpgradeByName("steve").owned) {
    $(".steve").stop(true);
    moveSteveRight();
  }
});

$(document).one("click", () => {
  if (!ended) playSound("theme.ogg", true, 0.1);
});

clicker.on("mousedown", () => {
  click();
});

$(document).on("keyup", (e) => {
  if (e.key == "p") {
    upgradePickaxe();
  } else if (e.key == "o") {
    upgradeOre();
  } else if (e.key == "m") {
    click();
  }
});

upgradePickaxeButton.on("click", () => {
  upgradePickaxe();
});

upgradeOreButton.on("click", () => {
  upgradeOre();
});

$(".upgrade-background").on("click", () => {
  backgroundUpgrade = getUpgradeByName("background");
  if (buyGpsUpgrade(backgroundUpgrade)) {
    playSound("upgrade.mp3", false);
    updateBackgroundUI();
  }
});

$(".upgrade-cow").on("click", () => {
  cowUpgrade = getUpgradeByName("cow");
  if (buyGpsUpgrade(cowUpgrade)) {
    playSound("upgrade.mp3", false);
    updateCowUI();
    updateUI();
  }
});

$(".upgrade-steve").on("click", () => {
  steveUpgrade = getUpgradeByName("steve");
  if (buyGpsUpgrade(steveUpgrade)) {
    playSound("upgrade.mp3", false);
    updateSteveUI();
    updateUI();
  }
});

$(".upgrade-creeper").on("click", () => {
  creeperUpgrade = getUpgradeByName("creeper");
  if (buyGpsUpgrade(creeperUpgrade)) {
    playSound("upgrade.mp3", false);
    updateCreeperUI();
    updateUI();
  }
});

$(".upgrade-singer").on("click", () => {
  singerUpgrade = getUpgradeByName("singer");
  if (buyGpsUpgrade(singerUpgrade)) {
    playSound("upgrade.mp3", false);
    updateSingerUI();
    updateUI();
  }
});

$(".upgrade-phantom").on("click", () => {
  phantomUpgrade = getUpgradeByName("phantom");
  if (buyGpsUpgrade(phantomUpgrade)) {
    playSound("upgrade.mp3", false);
    updatePhantomUI();
    updateUI();
  }
});

$(".upgrade-fatguy").on("click", () => {
  fatGuyUpgrade = getUpgradeByName("fatguy");
  if (buyGpsUpgrade(fatGuyUpgrade)) {
    playSound("upgrade.mp3", false);
    updateFatguyUI();
    updateUI();
  }
});

$(".upgrade-cave").on("click", () => {
  caveUpgrade = getUpgradeByName("cave");
  if (buyGpsUpgrade(caveUpgrade)) {
    playSound("upgrade.mp3", false);
    updateCaveUI();
    updateUI();
  }
});

$(".upgrade-clock").on("click", () => {
  clockUpgrade = getUpgradeByName("clock");
  if (buyGpsUpgrade(clockUpgrade)) {
    playSound("upgrade.mp3", false);
    updateClockUI();
    updateUI();
  }
});

$(".upgrade-exit").on("click", () => {
  if (buyGpsUpgrade(getUpgradeByName("exit"))) {
    ended = true;
    clearLocalStorage();
    stopAllSounds();
    stopAllIntervals();
    $(".ending").css("display", "flex");
    let endingProgress = 0;

    const interval = setInterval(() => {
      endingProgress += 1;
      $(".ending-progress").text(endingProgress + "%");

      if (endingProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    }, 100);
  }
});

$(".new-game").on("click", () => {
  exitIntroScreen();
  clearLocalStorage();
  updateUI();
});

$(".save").on("click", () => {
  saveToLocalStorage();
  alert("Game state saved!");
});

$(".load").on("click", () => {
  if (!loadLocalStorageData()) alert("No data found!");
  else {
    exitIntroScreen();
    reloadUI();
  }
});

$(".modal-backdrop").on("click", () => {
  $(".modal-wrapper").hide();
});

$(".btn-close").on("click", () => {
  $(".modal-wrapper").hide();
});

$(".btn-help").on("click", () => {
  $(".modal-wrapper").show();
});

$(".godmode").on("click", () => {
  coins = Infinity;
  gps = Infinity;
  gpc = Infinity;
  updateUI();
});

// INFO: UI FUNCTIONS

/**
 * Updates the UI with the current coins, gps, and gpc
 */
const updateUI = () => {
  //INFO: basig UI
  coinsElement.text(coins);
  $(".gps-data").text(gps);
  $(".gpc-data").text(gpc);

  //INFO: Ore upgrade UI
  clicker.attr("src", "assets/clickers/" + currentLevel.image);
  $("#upgrade-ore-cost").text(currentLevel.upgradeCost);
  if (currentLevelIndex >= LEVELS.length - 1) {
    upgradeOreButton.css("display", "none");
  } else {
    $(".upgrade-ore .upgrade-img").attr(
      "src",
      "assets/clickers/" + LEVELS[currentLevelIndex + 1].image
    );
  }

  if (coins >= currentLevel.upgradeCost) {
    upgradeOreButton.removeClass("disabled");
  } else {
    upgradeOreButton.addClass("disabled");
  }

  //INFO: Pickaxe upgrade UI
  $("#upgrade-pickaxe-cost").text(pickaxeUpgrade.cost);
  $(".upgrade-pickaxe .level").text("Level " + pickaxeUpgrade.level);

  if (coins >= pickaxeUpgrade.cost) {
    upgradePickaxeButton.removeClass("disabled");
  } else {
    upgradePickaxeButton.addClass("disabled");
  }

  // INFO: GPS upgrades UI
  gpsUpgrades.forEach((upgrade) => {
    if (
      upgrade.owned ||
      upgrade.requiredLevel > currentLevelIndex ||
      (upgrade.name === "exit" && !getUpgradeByName("clock").owned)
    ) {
      $(".upgrade-" + upgrade.name).css("display", "none");
    } else {
      $(".upgrade-" + upgrade.name).css("display", "flex");

      $("#upgrade-" + upgrade.name + "-cost").text(upgrade.cost);
      upgradeButton = $(".upgrade-" + upgrade.name + "");

      if (!upgrade.owned && coins >= upgrade.cost) {
        upgradeButton.removeClass("disabled");
      } else {
        upgradeButton.addClass("disabled");
      }
    }
  });
};

const reloadUI = () => {
  stopAllIntervals();
  stopAllSounds();
  playSound("theme.ogg", true, 0.1);
  // TODO: not the most elegant solution, couldnt be bothered, maybe someday
  if (getUpgradeByName("background").owned) updateBackgroundUI();
  if (getUpgradeByName("cow").owned) updateCowUI();
  if (getUpgradeByName("steve").owned) updateSteveUI();
  if (getUpgradeByName("creeper").owned) updateCreeperUI();
  if (getUpgradeByName("singer").owned) updateSingerUI();
  if (getUpgradeByName("phantom").owned) updatePhantomUI();
  if (getUpgradeByName("fatguy").owned) updateFatguyUI();
  if (getUpgradeByName("cave").owned) updateCaveUI();
  if (getUpgradeByName("clock").owned) updateClockUI();
  updateUI();
};

const updatePickaxeUI = () => {
  if (pickaxeUpgrade.level < 13) {
    playSound("pickaxe.mp3", true);
  }
};

const updateOreUI = () => {
  if (currentLevelIndex == 5) {
    playSound("theme2.ogg", true, 0.1);
  }
};

const updateBackgroundUI = () => {
  $(".gamearea").css("background-image", "url(assets/upgrades/background.jpg)");
  $(".upgrade-background").css("display", "none");
};

const updateCowUI = () => {
  intervalList.push(
    setInterval(() => {
      playSound("cow.mp3", false, 0.2);
    }, Math.floor(Math.random() * 15000) + 10000)
  );

  $(".cow").css("display", "block");
  $(".upgrade-cow").css("display", "none");
};

const updateSteveUI = () => {
  playSound("walking.mp3", true, 0.2);

  $(".steve").css("display", "block");
  $(".upgrade-steve").css("display", "none");
  moveSteveRight();
};

const updateCreeperUI = () => {
  startCreeperRain();

  $(".creeper").css("display", "block");
  $(".upgrade-creeper").css("display", "none");
};

const updateSingerUI = () => {
  playSound("mine_diamonds.ogg", true, 0.1);
  $(".upgrade-container").css(
    "background",
    "url(assets/upgrades/minediamonds.jpg)"
  );

  $(".upgrade-singer").css("display", "none");
};

const updatePhantomUI = () => {
  startPhantomSpawn();

  $(".upgrade-phantom").css("display", "none");
};

const updateFatguyUI = () => {
  playSound("lavachicken.ogg", true, 0.5);
  $(".clicker-container").css(
    "background",
    "url(assets/upgrades/lavachicken.gif)"
  );

  $(".upgrade-fatguy").css("display", "none");
};

const updateCaveUI = () => {
  intervalList.push(
    setInterval(() => {
      playSound("cave.ogg", false, 0.2);
    }, Math.floor(Math.random() * 15000) + 10000)
  );
  $(".upgrade-cave").css("display", "none");
};

const updateClockUI = () => {
  startCreeperRain([20, 20]);
  startPhantomSpawn([20, 20]);
  playSound("cow.mp3", true, 1);
  playSound("cave.ogg", true, 1);

  $(".upgrade-clock").css("display", "none");
};

// INFO: FUNCTIONS

const startgpsTimer = () => {
  gpsTimer = intervalList.push(
    setInterval(() => {
      //clgVars();
      coins += gps;
      updateUI();
    }, 1000)
  );
};

const click = () => {
  playSound("click.mp3", false);
  coins += gpc;
  updateUI();

  // INFO: css animation
  clicker.css("transform", "translate(-50%, -50%) scale(.9)");
  setTimeout(() => {
    clicker.css("transform", "translate(-50%, -50%) scale(1)");
  }, 100);
};

const upgradeOre = () => {
  if (
    currentLevelIndex < LEVELS.length - 1 &&
    coins >= currentLevel.upgradeCost
  ) {
    coins -= currentLevel.upgradeCost;
    currentLevelIndex++;
    currentLevel = LEVELS[currentLevelIndex];
    gpc = currentLevel.gpc;

    playSound("upgrade.mp3", false);
    updateOreUI();
    updateUI();
  }
};

const upgradePickaxe = () => {
  if (coins >= pickaxeUpgrade.cost) {
    coins -= pickaxeUpgrade.cost;
    pickaxeUpgrade.level++;
    pickaxeUpgrade.cost = Math.round(
      pickaxeUpgrade.cost * pickaxeUpgrade.costMultiplier
    );
    gps += pickaxeUpgrade.gps;
    playSound("upgrade.mp3", false);
    updatePickaxeUI();
    updateUI();
  }
};

/**
 * Plays a sound from the assets/sounds folder
 * @param {string} fileName
 * @param {boolean} loop
 */
const playSound = (fileName, loop, volume = 1) => {
  try {
    const sound = new Audio("assets/sounds/" + fileName);
    sound.loop = loop;
    sound.volume = volume;
    audioList.push(sound);
    // NOTE: catch needed if stopAllSounds() called before playSound() can finish playing
    sound.play().catch((e) => console.log("Sound playing interrupted"));
    sound.onended = () => {
      const index = audioList.indexOf(sound);
      if (index !== -1) audioList.splice(index, 1);
    };
  } catch (e) {
    // NOTE: same as above
    console.log("Error while trying to play sound");
  }
};

/**
 * Stops all sounds that are in the audioList array
 */
const stopAllSounds = () => {
  audioList.forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
};

/**
 * Returns upgrade object found by name
 * @param {string} name
 * @returns
 */
const getUpgradeByName = (name) => {
  return gpsUpgrades.find((upgrade) => upgrade.name === name);
};

const moveSteveRight = () => {
  const windowWidth = $(window).width();
  const steveWidth = $(".steve").outerWidth();
  const maxLeft = windowWidth - steveWidth;

  $(".steve img").css("transform", "scaleX(1)");

  $(".steve").animate({ left: maxLeft + "px" }, 25000, "linear", moveSteveLeft);
};

const moveSteveLeft = () => {
  $(".steve img").css("transform", "scaleX(-1)");
  $(".steve").animate({ left: "0px" }, 25000, "linear", moveSteveRight);
};

const spawnCreeper = () => {
  const creeper = $("<img>", {
    src: "assets/upgrades/creeper.png",
    alt: "creeper",
    class: "creeper",
  });
  const windowWidth = $(window).width();
  const windowHeight = $(window).height();
  const randomLeft = Math.floor(Math.random() * (windowWidth - 50));

  creeper.css({
    left: randomLeft + "px",
  });

  $("body").append(creeper);
  playSound("creeper_start.ogg", false, 0.5);

  creeper.animate(
    { top: windowHeight + "px" },
    Math.random() * 3000 + 2000,
    "linear",
    function () {
      $(this).remove();
      playSound("creeper_boom.ogg", false, 0.5);
    }
  );
};

const startCreeperRain = (timeoutInterval = [1000, 1500]) => {
  intervalList.push(
    setInterval(() => {
      spawnCreeper();
    }, Math.random() * timeoutInterval[0] + timeoutInterval[1])
  );
};

const spawnPhantom = () => {
  const phantom = $("<img>", {
    src: "assets/upgrades/phantom.png",
    alt: "phantom",
    class: "phantom",
  });
  const windowWidth = $(window).width();
  const windowHeight = $(window).height();
  const randomTop = Math.floor(Math.random() * (windowHeight - 50));

  phantom.css({
    top: randomTop + "px",
  });

  $("body").append(phantom);
  playSound("phantom.ogg", false, 1);

  phantom.animate(
    { right: windowWidth + "px" },
    Math.random() * 3000 + 2000,
    "linear",
    function () {
      $(this).remove();
    }
  );
};

const startPhantomSpawn = (timeoutInterval = [1000, 5000]) => {
  intervalList.push(
    setInterval(() => {
      spawnPhantom();
    }, Math.random() * timeoutInterval[0] + timeoutInterval[1])
  );
};

/**
 * Expects a gps upgrade object and returns whether or not the upgrade was successfully bought
 * @param {object} upgrade
 */
const buyGpsUpgrade = (upgrade) => {
  if (coins >= upgrade.cost) {
    coins -= upgrade.cost;
    gps += upgrade.gps;
    upgrade.owned = true;
    return true;
  }
  return false;
};

/**
 * Stops all intervals that are in the intervalList array
 */
const stopAllIntervals = () => {
  intervalList.forEach((interval) => {
    clearInterval(interval);
  });
};

const saveToLocalStorage = () => {
  localStorage.setItem("save-date", new Date().toLocaleDateString());
  localStorage.setItem("coins", coins);
  localStorage.setItem("gps", gps);
  localStorage.setItem("gpc", gpc);
  localStorage.setItem("currentLevelIndex", currentLevelIndex);
  localStorage.setItem("ended", ended);
  localStorage.setItem("pickaxeUpgrade", JSON.stringify(pickaxeUpgrade));
  localStorage.setItem("gpsUpgrades", JSON.stringify(gpsUpgrades));
};

const loadLocalStorageData = () => {
  if (localStorage.getItem("coins") == null) {
    return false;
  } else {
    if (localStorage.getItem("coins") == "Infinity") coins = Infinity;
    else coins = parseInt(localStorage.getItem("coins"));
    if (localStorage.getItem("gps") == "Infinity") gps = Infinity;
    else gps = parseInt(localStorage.getItem("gps"));
    if (localStorage.getItem("gpc") == "Infinity") gpc = Infinity;
    else gpc = parseInt(localStorage.getItem("gpc"));
    currentLevelIndex = parseInt(localStorage.getItem("currentLevelIndex"));
    currentLevel = LEVELS[currentLevelIndex];
    ended = localStorage.getItem("ended");
    pickaxeUpgrade = JSON.parse(localStorage.getItem("pickaxeUpgrade"));
    gpsUpgrades = JSON.parse(localStorage.getItem("gpsUpgrades"));

    return true;
  }
};

const clearLocalStorage = () => {
  localStorage.clear();
};

const exitIntroScreen = () => {
  $(".intro").css("display", "none");
  $(".gamearea").css("display", "block");
};

/**
 * DEBUG FUNCTION
 * Logs all variables to the console
 */
const clgVars = () => {
  console.log("coins", coins);
  console.log("gps", gps);
  console.log("gpc", gpc);
  console.log("currentLevelIndex", currentLevelIndex);
  console.log("ended", ended);
  console.log("pickaxeUpgrade", pickaxeUpgrade);
  console.log("gpsUpgrades", gpsUpgrades);
  console.log("LEVELS", LEVELS);
  console.log("currentLevel", currentLevel);
};
