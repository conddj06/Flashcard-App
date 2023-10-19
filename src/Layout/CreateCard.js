import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, createCard } from "../utils/api";
import CardForm from "./CardForm";

// Creates a new card in a specific deck
function CreateCard() {
  const initialFormState = {
    id: "",
    front: "",
    back: "",
    deckId: "",
  };

  const [deck, setDeck] = useState({
    // deck state var holds the current deck
    name: "loading...",
    description: "",
    cards: [],
  });
  const [newCardData, setNewCardData] = useState(initialFormState); // newCardData state var holds form data for new card

  const history = useHistory();
  const { deckId } = useParams(); // get access to the deck id from the URL

  // fetch deck data when component mounts or when the id changes
  useEffect(() => {
    const abortController = new AbortController();

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
    // abort controller is used to cancel the api request if the component unmounts before the request completes
    return () => {
      abortController.abort();
    };
  }, [deckId]);

  // event handlers for change and submit
  // update newCardData state whenever the user input changes
  const changeHandler = ({ target }) => {
    setNewCardData((currentState) => ({
      ...currentState,
      [target.name]: target.value,
    }));
  };
  // invoked when the form is submitted, uses createCard utility fn
  const submitHandler = async (event) => {
    event.preventDefault();
    await createCard(deckId, newCardData);
    setNewCardData(initialFormState);
    history.go(0);
  };
  // render JSX and CardForm component is passed props for deck id, card data and handlers
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
          <li className="breadcrumb-item active">Edit Deck</li>
        </ol>
      </nav>
      <h1 className="my-4">
        {deck.name}: <span>Add Card</span>
      </h1>
      <CardForm
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        newCardData={newCardData}
        deckId={deckId}
      />
    </>
  );
}

export default CreateCard;