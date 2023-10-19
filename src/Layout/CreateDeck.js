import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createDeck } from "../utils/api";

// component for creating a new deck
// form data is handled by react state management
function CreateDeck() {
  // define the initial state of the deck object
  const initialFormState = {
    name: "",
    description: "",
  };

  const [deckFormData, setDeckFormData] = useState(initialFormState); // state vars, holds the form data for a new deck

  const history = useHistory(); // hook into history stack

  // update state whenever the user input changes
  const onChangeHandler = ({ target }) => {
    setDeckFormData((currentDeckFormData) => ({
      ...currentDeckFormData,
      [target.name]: target.value,
    }));
  };

  // invoke handler when the form is submitted, using createDeck util fn
  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await createDeck(deckFormData);
    setDeckFormData(initialFormState);
    history.push(`/decks/${response.id}`);
  };
  // render JSX for breadcrumb, heading and form
  return (
    <>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">Create Deck</li>
        </ol>
      </nav>
      <form onSubmit={submitHandler}>
        <h1 className="my-4">Create Deck</h1>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            id="name"
            className="form-control form-control-lg"
            type="text"
            placeholder="Deck name"
            onChange={onChangeHandler}
            value={deckFormData.name}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="5"
            placeholder="Brief description of the deck"
            onChange={onChangeHandler}
            value={deckFormData.description}
            required
          />
        </div>
        <Link to="/" className="mr-2">
          <button type="button" className="btn btn-secondary">
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

export default CreateDeck;