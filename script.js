import { LEVELS } from "./constants/levels.js";

const coinsElement = $("#coins");
const clicker = $(".clicker-img");
const upgradeOreButton = $(".upgrade-ore");

var currentLevelIndex = 0;
var currentLevel = LEVELS[currentLevelIndex];
var cpc = currentLevel.cpc;
var coins = 0;

$().ready(() => {
  coinsElement.text(coins);
  console.log("document ready");
  console.log("current level", currentLevel);
  console.log(cpc);
});

clicker.on("mousedown", () => {
  coins += cpc;
  coinsElement.text(coins);
  console.log("added coins", cpc);

  clicker.css("transform", "translate(-50%, -50%) scale(.9)");
  setTimeout(() => {
    clicker.css("transform", "translate(-50%, -50%) scale(1)");
  }, 100);
});

upgradeOreButton.on("click", () => {
  upgradeOre();
});

const upgradeOre = () => {
  currentLevelIndex++;
  currentLevel = LEVELS[currentLevelIndex];
  cpc = currentLevel.cpc;
  clicker.attr("src", "assets/clickers/" + currentLevel.image);
  console.log("upgraded to level", currentLevelIndex);
  console.log("current level", currentLevel);
};
