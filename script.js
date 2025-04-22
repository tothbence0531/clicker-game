const LEVELS = [
  { name: "Stone", gpc: 1, upgradeCost: 300, image: "stone.webp" },
  { name: "Coal", gpc: 4, upgradeCost: 1_200, image: "coal.webp" },
  { name: "Iron", gpc: 10, upgradeCost: 4_000, image: "iron.webp" },
  { name: "Redstone", gpc: 20, upgradeCost: 12_000, image: "redstone.webp" },
  { name: "Gold", gpc: 40, upgradeCost: 35_000, image: "gold.webp" },
  { name: "Emerald", gpc: 75, upgradeCost: 90_000, image: "emerald.webp" },
  { name: "Diamond", gpc: 150, upgradeCost: 250_000, image: "diamond.webp" },
];

const pickaxeUpgrade = {
  level: 0,
  gps: 2,
  cost: 100,
  costMultiplier: 1.18,
};

const gpsUpgrades = [
  { name: "background", cost: 800, gps: 3 },
  { name: "cow", cost: 2_000, gps: 7 },
  { name: "steve", cost: 4_500, gps: 15 },
  { name: "creeper", cost: 10_000, gps: 30 },
  { name: "singer", cost: 20_000, gps: 50 },
  { name: "phantom", cost: 35_000, gps: 75 },
  { name: "fatguy", cost: 55_000, gps: 110 },
  { name: "cave", cost: 85_000, gps: 160 },
  { name: "clock", cost: 130_000, gps: 240 },
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

// INFO: EVENTS

$(document).ready(() => {
  $(".modal-wrapper").hide();
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
  playSound("theme.ogg", true, 0.1);
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
    $("body").css("background-image", "url(assets/upgrades/background.jpg)");
    $(".upgrade-background").css("display", "none");
  }
});

$(".upgrade-cow").on("click", () => {
  cowUpgrade = getUpgradeByName("cow");
  if (buyGpsUpgrade(cowUpgrade)) {
    playSound("upgrade.mp3", false);
    setInterval(() => {
      playSound("cow.mp3", false, 0.2);
    }, Math.floor(Math.random() * 15000) + 10000);

    $(".cow").css("display", "block");
    $(".upgrade-cow").css("display", "none");
    updateUI();
  }
});

$(".upgrade-steve").on("click", () => {
  steveUpgrade = getUpgradeByName("steve");
  if (buyGpsUpgrade(steveUpgrade)) {
    playSound("upgrade.mp3", false);
    playSound("walking.mp3", true, 0.2);

    $(".steve").css("display", "block");
    $(".upgrade-steve").css("display", "none");
    moveSteveRight();
    updateUI();
  }
});

$(".upgrade-creeper").on("click", () => {
  creeperUpgrade = getUpgradeByName("creeper");
  if (buyGpsUpgrade(creeperUpgrade)) {
    playSound("upgrade.mp3", false);
    startCreeperRain();

    $(".creeper").css("display", "block");
    $(".upgrade-creeper").css("display", "none");
    updateUI();
  }
});

$(".upgrade-singer").on("click", () => {
  singerUpgrade = getUpgradeByName("singer");
  if (buyGpsUpgrade(singerUpgrade)) {
    playSound("upgrade.mp3", false);
    playSound("mine_diamonds.ogg", true, 0.1);
    $(".upgrade-container").css(
      "background",
      "url(assets/upgrades/minediamonds.jpg)"
    );

    $(".upgrade-singer").css("display", "none");
    updateUI();
  }
});

$(".upgrade-phantom").on("click", () => {
  phantomUpgrade = getUpgradeByName("phantom");
  if (buyGpsUpgrade(phantomUpgrade)) {
    playSound("upgrade.mp3", false);
    startPhantomSpawn();

    $(".upgrade-phantom").css("display", "none");
    updateUI();
  }
});

$(".upgrade-fatguy").on("click", () => {
  fatGuyUpgrade = getUpgradeByName("fatguy");
  if (buyGpsUpgrade(fatGuyUpgrade)) {
    playSound("upgrade.mp3", false);
    playSound("lavachicken.ogg", true, 0.5);
    $(".clicker-container").css(
      "background",
      "url(assets/upgrades/lavachicken.gif)"
    );

    $(".upgrade-fatguy").css("display", "none");
    updateUI();
  }
});

$(".upgrade-cave").on("click", () => {
  caveUpgrade = getUpgradeByName("cave");
  if (buyGpsUpgrade(caveUpgrade)) {
    playSound("upgrade.mp3", false);
    setInterval(() => {
      playSound("cave.ogg", false, 0.2);
    }, Math.floor(Math.random() * 15000) + 10000);
    $(".upgrade-cave").css("display", "none");
    updateUI();
  }
});

$(".upgrade-clock").on("click", () => {
  clockUpgrade = getUpgradeByName("clock");
  if (buyGpsUpgrade(clockUpgrade)) {
    playSound("upgrade.mp3", false);

    startCreeperRain([20, 20]);
    startPhantomSpawn([20, 20]);
    playSound("cow.mp3", true, 1);
    playSound("cave.ogg", true, 1);

    $(".upgrade-clock").css("display", "none");
    updateUI();
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

// INFO: FUNCTIONS

const startgpsTimer = () => {
  gpsTimer = setInterval(() => {
    coins += gps;
    updateUI();
  }, 1000);
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
    if (currentLevelIndex == 4) {
      playSound("theme2.ogg", true, 0.1);
    }
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
    playSound("pickaxe.mp3", true);
    updateUI();
  }
};

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
    $("#upgrade-" + upgrade.name + "-cost").text(upgrade.cost);
    upgradeButton = $(".upgrade-" + upgrade.name + "");

    if (!upgrade.owned && coins >= upgrade.cost) {
      upgradeButton.removeClass("disabled");
    } else {
      upgradeButton.addClass("disabled");
    }
  });
};

/**
 * Plays a sound from the assets/sounds folder
 * @param {string} fileName
 * @param {boolean} loop
 */
const playSound = (fileName, loop, volume = 1) => {
  const sound = new Audio("assets/sounds/" + fileName);
  sound.loop = loop;
  sound.volume = volume;
  sound.play();
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
  setInterval(() => {
    spawnCreeper();
  }, Math.random() * timeoutInterval[0] + timeoutInterval[1]);
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
  setInterval(() => {
    spawnPhantom();
  }, Math.random() * timeoutInterval[0] + timeoutInterval[1]);
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
