- Simple ----------------------------------

var config = {
  bet: { label: "bet", value: currency.minAmount, type: "number" },
  payout: { label: "payout", value: 2, type: "number" },
};

function main() {
  game.onBet = function() {
    game.bet(config.bet.value, config.payout.value).then(function(payout) {
      if (payout > 1) {
        log.success("We won, payout " + payout + "X!");
      } else {
        log.error("We lost, payout " + payout + "X!");
      }
    });
  };
}

- Martingale --------------------------------

var config = {
  baseBet: { label: "base bet", value: currency.minAmount, type: "number" },
  payout: { label: "payout", value: 2, type: "number" },
  stop: { label: "stop if next bet >", value: 1e8, type: "number" },
  onLoseTitle: { label: "On Lose", type: "title" },
  onLoss: {
    label: "",
    value: "reset",
    type: "radio",
    options: [
      { value: "reset", label: "Return to base bet" },
      { value: "increase", label: "Increase bet by (loss multiplier)" },
    ],
  },
  lossMultiplier: { label: "loss multiplier", value: 2, type: "number" },
  onWinTitle: { label: "On Win", type: "title" },
  onWin: {
    label: "",
    value: "reset",
    type: "radio",
    options: [
      { value: "reset", label: "Return to base bet" },
      { value: "increase", label: "Increase bet by (win multiplier)" },
    ],
  },
  winMultiplier: { label: "win multiplier", value: 2, type: "number" },
};
function main() {
  var currentBet = config.baseBet.value;
  game.onBet = function () {
    game.bet(currentBet, config.payout.value).then(function (payout) {
      if (payout > 1) {
        if (config.onWin.value === "reset") {
          currentBet = config.baseBet.value;
        } else {
          currentBet *= config.winMultiplier.value;
        }
        log.success(
          "We won, so next bet will be " +
            currentBet +
            " " +
            currency.currencyName
        );
      } else {
        if (config.onLoss.value === "reset") {
          currentBet = config.baseBet.value;
        } else {
          currentBet *= config.lossMultiplier.value;
        }
        log.error(
          "We lost, so next bet will be " +
            currentBet +
            " " +
            currency.currencyName
        );
      }
      if (currentBet > config.stop.value) {
        log.error(
          "Was about to bet " + currentBet + " which triggers the stop"
        );
        game.stop();
      }
    });
  };
}

- Payout Martingale ----------------------------------------

var config = {
  bet: { label: "bet", value: currency.minAmount, type: "number" },
  basePayout: { label: "base payout", value: 2, type: "number" },
  stop: { value: 20, type: "number", label: "stop if next payout >" },
  onLoseTitle: { label: "On Lose", type: "title" },
  onLoss: {
    label: "",
    value: "reset",
    type: "radio",
    options: [
      { value: "reset", label: "Return to base bet" },
      { value: "increase", label: "Increase payout by (loss payout)" },
    ],
  },
  lossAdd: { label: "loss payout +", value: 1, type: "number" },
  onWinTitle: { label: "On Win", type: "title" },
  onWin: {
    label: "",
    value: "reset",
    type: "radio",
    options: [
      { value: "reset", label: "Return to base bet" },
      { value: "increase", label: "Increase payout by (win payout)" },
    ],
  },
  winAdd: { label: "win payout +", value: 1, type: "number" },
};

function main() {
  var currentPayout = config.basePayout.value;
  game.onBet = function () {
    game.bet(config.bet.value, currentPayout).then(function (payout) {
      if (payout > 1) {
        if (config.onWin.value === "reset") {
          currentPayout = config.basePayout.value;
        } else {
          currentPayout += config.winAdd.value;
        }
        log.success("We won, so next payout will be " + currentPayout + " x");
      } else {
        if (config.onLoss.value === "reset") {
          currentPayout = config.basePayout.value;
        } else {
          currentPayout += config.lossAdd.value;
        }
        log.error("We lost, so next payout will be " + currentPayout + " x");
      }
      if (currentPayout > config.stop.value) {
        log.error(
          "Was about to bet with payout " +
            currentPayout +
            " which triggers the stop"
        );
        game.stop();
      }
    });
  };
}