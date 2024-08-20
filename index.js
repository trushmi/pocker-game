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
// *-* public methods *-*

const init = () => {
  button.addEventListener("click", eventPlayAgainClicked);
  newPlayerBtn.addEventListener("click", addPlayer);
  document
    .getElementById("remove-player")
    .addEventListener("click", removePlayer);
  eventPlayAgainClicked();
};
// expose public methods
// *-* utility methods *-*
const addPlayer = () => {
  const playersContainer = document.getElementById("players-container");
  const handsContainers = document.getElementsByClassName("hand");
  const section = document.createElement("section");
  section.className = "hand";

  const h1 = document.createElement("h1");
  h1.className = "player-label";
  h1.textContent = `Player ${handsContainers.length + 1}`;

  const handCardWrapper = document.createElement("div");
  handCardWrapper.className = "hand-card-wrapper";

  section.appendChild(h1);
  section.appendChild(handCardWrapper);
  playersContainer.appendChild(section);
};
const getRandomNumberUpTo = (limit) => {
  return Math.floor(Math.random() * limit);
};

const get90PercentChancePairIndex = (cards, deck) => {
  const random = getRandomNumberUpTo(101);
  if (random > 90) {
    return getRandomNumberUpTo(deck.length);
  }

  const cardsSet = new Set(cards.map((cardObject) => cardObject.card));

  return deck.findIndex((cardInDeck) => cardsSet.has(cardInDeck.card));
};
const generateDeck = () => {
  const newDeck = [];

  for (const suit of suits) {
    for (const card of cards) {
      newDeck.push({
        suit: suit,
        card: card,
      });
    }
  }

  return newDeck;
};

window.onload = Poker.init;
