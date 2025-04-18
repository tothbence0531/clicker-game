const LEVELS = [
  {
    name: "Stone",
    gpc: 1,
    upgradeCost: 100,
    image: "stone.webp",
  },
  {
    name: "Coal",
    gpc: 5,
    upgradeCost: 1000,
    image: "coal.webp",
  },
  {
    name: "Iron",
    gpc: 10,
    upgradeCost: 5_000,
    image: "iron.webp",
  },
  {
    name: "Redstone",
    gpc: 25,
    upgradeCost: 30_000,
    image: "redstone.webp",
  },
  {
    name: "Gold",
    gpc: 50,
    upgradeCost: 80_000,
    image: "gold.webp",
  },
  {
    name: "Emerald",
    gpc: 100,
    upgradeCost: 150_000,
    image: "emerald.webp",
  },
  {
    name: "Diamond",
    gpc: 200,
    upgradeCost: 100_000_000,
    image: "diamond.webp",
  },
];
const pickaxeUpgrade = {
  level: 0,
  gps: 1,
  cost: 50,
  costMultiplier: 1.2,
};

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
