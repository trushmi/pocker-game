const Poker = (() => {
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

  // *-* public methods *-*

  const init = () => {
    button.addEventListener("click", eventPlayAgainClicked);
    newPlayerBtn.addEventListener("click", addPlayer);
    document
      .getElementById("remove-player")
      .addEventListener("click", removePlayer);
    eventPlayAgainClicked();
  };

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

  const dealHands = (numberOfPlayers = 2) => {
    const numberOfCards = 5; // we deal 5 cards to each player and out our loop responsible for it;
    const hands = []; // we have 2 hands because we have 2 players;
    const deck = generateDeck();

    const playerStats = new Map();

    for (let cardIndex = 0; cardIndex < numberOfCards; cardIndex++) {
      // we want to deal cards step by step, so each player has the same odds
      // so we first deal the first card for each player, then second card for each player, etc.
      for (let playerIndex = 0; playerIndex < numberOfPlayers; playerIndex++) {
        if (!hands[playerIndex]) {
          hands[playerIndex] = {
            numberOfPairs: 0,
            cardsMap: new Map(),
            cards: [],
            pair1Set: new Set(),
            pair2Set: new Set(),
          };
        }

        const hand = hands[playerIndex]; //there is only 2 hands, so we specify current hand;

        const isLastCardAndNoPair =
          cardIndex === numberOfCards - 1 && hand.numberOfPairs === 0;

        // if we are dealing the last card and we don't have a pair - we cheat.
        const randomDeckIndex = isLastCardAndNoPair
          ? get90PercentChancePairIndex(hand.cards, deck)
          : getRandomNumberUpTo(deck.length);

        const cardObject = deck[randomDeckIndex];

        // we remove the card from the deck, since it's assigned to the hand now
        deck.splice(randomDeckIndex, 1);

        // now let's calculate all the information needed for the game rendering
        // and determining the winner
        const card = cardObject.card;

        // we use the Map to store cards currently in the hand,
        // to easily determine if there is a pair
        if (hand.cardsMap.has(card)) {
          hand.numberOfPairs++;

          // we use two Sets to store indexes of the pairs
          if (hand.pair1Set.size > 0) {
            hand.pair2Set.add(hand.cardsMap.get(card));
            hand.pair2Set.add(cardIndex);
          } else {
            hand.pair1Set.add(hand.cardsMap.get(card));
            hand.pair1Set.add(cardIndex);
          }

          // we remove the card from the map after we found the pair, so it doesn't match
          // with any of the next cards
          hand.cardsMap.delete(card);
        } else {
          // if we don't have this card yet - we just add it to the map
          hand.cardsMap.set(card, cardIndex);
        }

        hand.cards.push(cardObject);
      }
    }

    return hands;
  };

  const createCardUrl = ({ suit, card }) => {
    return `https://raw.githubusercontent.com/uzair-ashraf/storage-bucket/master/cards/${suit}_${card}.png`;
  };

  const renderHand = (hand, cardsContainer) => {
    for (let cardIndex = 0; cardIndex < hand.cards.length; cardIndex++) {
      // we use timeout to render card one by one.
      // we could have used animation-delay css property instead
      setTimeout(() => {
        const card = hand.cards[cardIndex];
        const cardWrapper = document.createElement("div");
        cardWrapper.className = "card-container";

        const cardImage = document.createElement("img");
        cardImage.src = createCardUrl(card);
        cardImage.className = "card";

        if (hand.pair1Set.has(cardIndex)) {
          cardImage.classList.add("pair0");
        }

        if (hand.pair2Set.has(cardIndex)) {
          cardImage.classList.add("pair1");
        }

        cardWrapper.append(cardImage);
        cardsContainer.appendChild(cardWrapper);

        // we delay each render by 200ms. So the first card is going to be rendered immediately,
        // next in 200ms, next in 400ms, 600ms, etc.
      }, 200 * cardIndex);
    }
  };

  const clearsCardContainer = (containerElement) => {
    while (containerElement.firstChild) {
      containerElement.removeChild(containerElement.firstChild);
    }
  };
  const removePlayer = () => {
    const playersContainer = document.getElementById("players-container");
    const handsContainers = document.getElementsByClassName("hand");
    if (handsContainers.length > 2) {
      playersContainer.removeChild(handsContainers[handsContainers.length - 1]);
    }
  };
  // *-* event methods *-*

  const eventPlayAgainClicked = () => {
    // we reset our game container class name
    gameContainer.classList.remove("finished");

    // we select all sections with "hand" classBame
    const handsContainers = document.getElementsByClassName("hand");

    // this implementation supports more than 2 players!!!
    // in order for it to work we need to change number here and add additional section in HTML
    // with the "hand" class
    const hands = dealHands(handsContainers.length);

    // we will store the winner hand container here.
    const winnerHand = { numberOfPairs: 0, container: null };

    for (let i = 0; i < hands.length; i++) {
      const handContainer = handsContainers[i];

      // we reset the className on the handContainer
      handContainer.classList.remove("winning");

      // we also clear the cards container of the cards
      const cardsContainer =
        handContainer.getElementsByClassName("hand-card-wrapper")[0];
      clearsCardContainer(cardsContainer);

      // we render our hand to the container
      renderHand(hands[i], cardsContainer);

      // if two players have same number of pairs - nobody wins
      if (hands[i].numberOfPairs === winnerHand.numberOfPairs) {
        winnerHand.container = null;
      }

      if (hands[i].numberOfPairs > winnerHand.numberOfPairs) {
        winnerHand.numberOfPairs = hands[i].numberOfPairs;
        winnerHand.container = handContainer;
      }
    }

    // we want to have a delay before we display pairs and the winner
    if (winnerHand.container) {
      winnerHand.container.classList.add("winning");
    }

    // we want the pair information and winner to apper with the delay and animation
    setTimeout(() => {
      gameContainer.classList.add("finished");
    }, 1500);
  };

  // expose public methods
  return {
    init: init,
  };
})();

window.onload = Poker.init;
