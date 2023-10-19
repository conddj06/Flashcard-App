import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listDecks, deleteDeck } from "../utils/api";

function Home() {
  const [decks, setDecks] = useState([]); // initialize state var decks to empty array
  // when component is mounted run the function inside useEffect
  useEffect(() => {
    const fetchDecks = async () => {
      // fetchDecks retrieves the list of decks from the API using listDecks
      const deckResponse = await listDecks();
      setDecks(deckResponse); // update decks state with the response
    };
    fetchDecks();
  }, []);
  // async function that handles deck deletion
  const handleDelete = async (deckId) => {
    // check if user really wants to delete the deck
    if (
      window.confirm("Delete this deck? You will not be able to recover it.")
    ) {
      await deleteDeck(deckId); // call deleteDeck from API to delete the deck with matching id
      const updatedDecks = decks.filter((deck) => deck.id !== deckId); // update the decks state by filtering out the deleted deck
      setDecks(updatedDecks);
    }
  };

  // render buttons for creating new deck, a list of all existing decks
  return (
    <div className="container">
      <div className="d-flex justify-content-start align-items-center mt-3 mb-3">
        <Link to="/decks/new" className="btn btn-secondary ml-3">
          Create Deck
        </Link>
      </div>

      {decks.map((deck) => (
        <div className="card mb-3" key={deck.id}>
          <div className="card-body">
            <h5 className="card-title">{deck.name}</h5>
            <p className="card-text">{`${deck.cards.length} cards`}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Link
                  to={`/decks/${deck.id}`}
                  className="btn btn-secondary mr-2"
                >
                  View
                </Link>
                <Link
                  to={`/decks/${deck.id}/study`}
                  className="btn btn-primary mr-2"
                >
                  Study
                </Link>
              </div>
              <button
                onClick={() => handleDelete(deck.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;