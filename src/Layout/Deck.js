import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory, Route } from "react-router-dom";
import { deleteDeck, readDeck } from "../utils/api";
import ViewCards from "./ViewCards";

function Deck() {
  // get deck id parameter from the route, manipulate history and set deck state var with loading state
  const { deckId } = useParams();
  const history = useHistory();
  const [deck, setDeck] = useState({ name: "loading...", cards: [] });
  // runs loadDeck when the component mounts and whenever deckId changes in dependency array
  useEffect(() => {
    async function loadDeck() {
      const response = await readDeck(deckId); // loadDeck makes an api call using readDeck util fn
      setDeck(() => ({ ...response }));
    }

    loadDeck();
  }, [deckId]);
  // handler to delete a deck, asks for user confirmation
  const deleteHandler = async (deckId) => {
    const confirmation = window.confirm(
      "Delete this deck? You will not be able to recover it."
    );
    if (confirmation) {
      await deleteDeck(deckId);
      history.push("/"); // redirect the user to the homepage after a delete
    }
  };
  // render nav, a card with the deck info and event buttons as well as ViewCards component which displays cards in a deck
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">{deck.name}</li>
        </ol>
      </nav>
      <div className="card">
        <div className="card-header">
          <h2>{deck.name}</h2>
        </div>
        <div className="card-body">
          <blockquote className="blockquote mb-0">
            <p>{deck.description}</p>
          </blockquote>
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <Link
                to={`/decks/${deck.id}/edit`}
                className="btn btn-secondary mr-2"
              >
                Edit
              </Link>
              <Link
                to={`/decks/${deck.id}/study`}
                className="btn btn-primary mr-2"
              >
                Study
              </Link>
              <Link
                to={`/decks/${deck.id}/cards/new`}
                className="btn btn-primary mr-2"
              >
                Add Cards
              </Link>
            </div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => deleteHandler(deckId)}
            >
              Delete Deck
            </button>
          </div>
        </div>
      </div>
      <Route>
        <ViewCards cards={deck.cards} />
      </Route>
    </>
  );
}

export default Deck;