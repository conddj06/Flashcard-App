import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { readDeck } from "../utils/api";

function Study() {
  // define initial state
  // deck is obj representing a deck of cards, initally filled with placeholder name and empty array of cards
  const initialState = {
    deck: { name: "loading...", cards: [] },
    isCardFlipped: false, // boolean representing if the card is flipped or not, initially set to false in order to show the question side
    currentIndex: 0, // current index of card in the deck being displayed, initially set to 0
  };

  const [studyState, setStudyState] = useState(initialState); // inital value of studyState set to initialState
  const { deck, isCardFlipped, currentIndex } = studyState; // destructure studyState for easier property access
  const { deckId } = useParams(); // extract the deck id to use in url when component mounts
  // load the deck for the study session whenever the deck id changes
  useEffect(() => {
    const abortController = new AbortController(); // abort controller here is for cancelling the api call if the component unmounts before the call has resolved
    async function loadDeck() {
      try {
        const loadedDeck = await readDeck(deckId, abortController.signal);
        setStudyState((currentState) => ({
          ...currentState,
          deck: loadedDeck, // spread into new obj to keep the existing state and update deck property with the newly loaded deck
        }));
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }
    loadDeck();
    // cleanup function
    return () => {
      abortController.abort();
    };
  }, [deckId]); // dependency array, effect will run whenever the deck id changes

  // changes the isCardFlipped state prop in the studyState
  function flipCardHandler() {
    setStudyState({
      // modify the studyState obj
      ...studyState, // use spread op to create a new obj that contains props of the current studyState obj
      isCardFlipped: !studyState["isCardFlipped"], // prop from studyState obj above, tells whether card is flipped or not
    });
  }

  function getNextCardHandler() {
    // deconstruct deck object to get cards array
    const { cards } = deck;
    // check whether the current card is the last card in the cards array
    // currentIndex is the position of the current card in the cards array
    if (currentIndex === cards.length - 1) {
      // cards.length - 1 means we are at the last card
      const response = window.confirm(
        'Restart cards?\n\nClick "cancel" to return to the homepage' // ask if user wants to restart and study again at the end of deck
      );
      // if response is true reset currentIndex to 0
      if (response) {
        setStudyState((currentState) => ({
          ...currentState, // use spread op to create new object, copy all props from current state
          currentIndex: 0,
        }));
      }
    } else {
      setStudyState((currentState) => ({
        ...currentState,
        currentIndex: currentState.currentIndex + 1,
        isCardFlipped: false,
      }));
    }
  }
  // bind a breadcrumb JSX inside a variable
  const breadcrumb = (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to={`/decks/${deckId}`}>{deck.name}</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          Study
        </li>
      </ol>
    </nav>
  );
  // JSX to return if there are less than 3 cards in the deck
  if (deck.cards.length <= 2) {
    return (
      <>
        {breadcrumb}
        <div className="card">
          <div className="card-body">
            <h1>{deck.name}: Study</h1>
            <h2 className="card-title">Not enough cards.</h2>
            <p className="card-text">
              You need at least 3 cards to study. There are {deck.cards.length}
              {" cards "}
              in this deck.
            </p>
            <Link to={`/decks/${deckId}/cards/new`}>
              <button type="button" className="btn btn-primary">
                Add Card
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {breadcrumb}
        <h1 className="text-center">Study: {deck.name} </h1>
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              Card {currentIndex + 1} of {deck.cards.length}
            </h4>
            <h5 className="card-text">
              {!isCardFlipped
                ? `Question: ${deck.cards[currentIndex].front}`
                : `Answer: ${deck.cards[currentIndex].back}`}
            </h5>
          </div>
          <button
            type="button"
            className="btn btn-secondary py-3"
            onClick={flipCardHandler}
          >
            Flip
          </button>
          {isCardFlipped && (
            <button
              className="btn btn-primary py-3"
              onClick={getNextCardHandler}
            >
              Next
            </button>
          )}
        </div>
      </>
    );
  }
}

export default Study;