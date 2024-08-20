const Poker = () => {
  const gameContainer = document.getElementById("poker-game");
  const button = document.getElementById("play-again");
  const newPlayerBtn = document.getElementById("add-player");
  const suits = ["spade", "heart", "diamond", "club"];

  const cards = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  const hand1Container = document.getElementById("hand-1-container");
  const hand2Container = document.getElementById("hand-2-container");
};

window.onload = Poker.init;
