import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { readDeck, readCard, updateCard } from "../utils/api";
import CardForm from "./CardForm";

// component to edit an existing card in the deck
function EditCard() {
  const { deckId, cardId } = useParams();
  const history = useHistory();

  const initialCardState = {
    id: "",
    front: "",
    back: "",
    deckId: "",
  };
  const [deck, setDeck] = useState({ name: "loading...", description: "" });
  const [editCard, setEditCard] = useState(initialCardState);
  // runs when the component mounts and whenever the deckId in dependency array changes
  useEffect(() => {
    const abortController = new AbortController();
    // fetch data for the deck using readDeck inside of loadDeck
    async function loadDeck() {
      try {
        const loadedDeck = await readDeck(deckId, abortController.signal);
        setDeck(loadedDeck);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }

    loadDeck();

    return () => {
      abortController.abort();
    };
  }, [deckId]);
  // fetches the specific card using readCard, update editCard state
  useEffect(() => {
    const abortController = new AbortController();

    async function loadCard() {
      try {
        const loadedCard = await readCard(cardId, abortController.signal);

        setEditCard(loadedCard);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }

    loadCard();

    return () => {
      abortController.abort();
    };
  }, [cardId]); // dependency array

  // handles changes in form fields, updates the corresponding field
  const changeHandler = ({ target }) => {
    setEditCard((currentState) => ({
      ...currentState,
      [target.name]: target.value,
    }));
  };
  // handler for when the form is submitted, makes a request to update the card using updateCard
  const submitHandler = async (event) => {
    event.preventDefault();
    await updateCard(editCard);
    setEditCard(initialCardState); // reset editCard to its initial state
    history.push(`/decks/${deckId}`); // navigate to deck route
  };
  // render JSX breadcrumb, heading and CardForm component
  return (
    <>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>

          <li className="breadcrumb-item">
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>

          <li className="breadcrumb-item active">Edit Card {cardId}</li>
        </ol>
      </nav>

      <h1 className="mb-4">Edit Card</h1>

      <CardForm
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        newCardData={editCard}
        deckId={deckId}
      />
    </>
  );
}

export default EditCard;