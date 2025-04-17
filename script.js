const LEVELS = [
  {
    name: "Stone",
    cpc: 1,
    upgradeCost: 100,
    image: "stone.webp",
  },
  {
    name: "Coal",
    cpc: 5,
    upgradeCost: 1000,
    image: "coal.webp",
  },
  {
    name: "Iron",
    cpc: 10,
    upgradeCost: 5_000,
    image: "iron.webp",
  },
  {
    name: "Redstone",
    cpc: 25,
    upgradeCost: 30_000,
    image: "redstone.webp",
  },
  {
    name: "Gold",
    cpc: 50,
    upgradeCost: 80_000,
    image: "gold.webp",
  },
  {
    name: "Emerald",
    cpc: 100,
    upgradeCost: 150_000,
    image: "emerald.webp",
  },
  {
    name: "Diamond",
    cpc: 200,
    upgradeCost: 100_000_000,
    image: "diamond.webp",
  },
];
const pickaxeUpgrade = {
  level: 0,
  cps: 1,
  cost: 50,
  costMultiplier: 1.2,
};

const coinsElement = $("#coins");
const clicker = $(".clicker-img");
const upgradeOreButton = $(".upgrade-ore");
const upgradePickaxeButton = $(".upgrade-pickaxe");
const upgradeElement = $(".upgrade");

var currentLevelIndex = 0;
var currentLevel = LEVELS[currentLevelIndex];
var cpc = currentLevel.cpc;
var coins = 990000;
var cps = 0;

// INFO: EVENTS

$(document).ready(() => {
  updateUI();
  startCpsTimer();
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

// INFO: FUNCTIONS

const startCpsTimer = () => {
  cpsTimer = setInterval(() => {
    coins += cps;
    updateUI();
  }, 1000);
};

const click = () => {
  playSound("click.mp3", false);
  coins += cpc;
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
    cpc = currentLevel.cpc;

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
    cps += pickaxeUpgrade.cps;
    playSound("upgrade.mp3", false);
    playSound("pickaxe.mp3", true);
    updateUI();
  }
};

/**
 * Updates the UI with the current coins, cps, and cpc
 */
const updateUI = () => {
  //INFO: basig UI
  coinsElement.text(coins);
  $("#cps").text(cps);
  $("#cpc").text(cpc);

  //INFO: Ore upgrade UI
  clicker.attr("src", "assets/clickers/" + currentLevel.image);
  $("#upgrade-ore-cost").text("Cost: " + currentLevel.upgradeCost + " coins");
  if (currentLevelIndex >= LEVELS.length - 1) {
    upgradeOreButton.css("display", "none");
  } else {
    $(".upgrade-ore img").attr(
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
  $("#upgrade-pickaxe-cost").text("Cost: " + pickaxeUpgrade.cost + " coins");
  $(".upgrade-pickaxe span").text("Level " + pickaxeUpgrade.level);

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
