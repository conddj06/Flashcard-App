import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, updateDeck } from "../utils/api";

// component to edit an existing deck
function EditDeck() {
  const initialState = { name: "", description: "" };
  const [editDeckFormData, setEditDeckFormData] = useState(initialState);

  const { deckId } = useParams();
  const history = useHistory();
  // runs when the component mounts and when deckId changes
  useEffect(() => {
    const abortController = new AbortController();
    async function loadDeck() {
      // fetch data with loadDeck using readDeck inside
      try {
        const loadedDeck = await readDeck(deckId, abortController.signal);
        setEditDeckFormData(loadedDeck); // update the state
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

  // handles changes in the form fields
  const changeHandler = ({ target }) => {
    setEditDeckFormData((currentState) => ({
      ...currentState,
      [target.name]: target.value,
    }));
  };
  // this handler is called when the form is submitted
  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await updateDeck(editDeckFormData); // request to update the deck using updateDeck
    history.push(`/decks/${response.id}`); // navigate to the deck's route
  };
  // render the JSX
  return (
    <>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${deckId}`}>
              {editDeckFormData ? editDeckFormData.name : "Loading..."}
            </Link>
          </li>
          <li className="breadcrumb-item active">Edit Deck</li>
        </ol>
      </nav>
      <form onSubmit={submitHandler}>
        <h1 className="my-4">Edit Deck</h1>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            id="name"
            className="form-control form-control-lg"
            type="text"
            placeholder="Deck name"
            onChange={changeHandler}
            value={editDeckFormData.name}
            required
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="5"
            placeholder="Brief description of deck"
            onChange={changeHandler}
            value={editDeckFormData.description}
            required
          ></textarea>
        </div>
        <Link to="/" className="mr-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => history.push(`/decks/${deckId}`)}
          >
            Cancel
          </button>
        </Link>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
}

export default EditDeck;