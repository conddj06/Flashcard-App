import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "./Home";
import Study from "./Study";
import CreateDeck from "./CreateDeck";
import Deck from "./Deck";
import EditDeck from "./EditDeck";
import CreateCard from "./CreateCard";
import EditCard from "./EditCard";

function Layout() {
  return (
    <>
      <Header />
      <div className="container">
        <Switch>
          {/* Home component */}
          <Route exact path="/">
            <Home />
          </Route>

          {/* Create Deck Component */}
          <Route exact path="/decks/new">
            <CreateDeck />
          </Route>

          {/* Study Deck Component */}
          <Route exact path="/decks/:deckId/study">
            <Study />
          </Route>

          {/* EditDeck Component */}
          <Route exact path="/decks/:deckId/edit">
            <EditDeck />
          </Route>

          {/* Deck Component */}
          <Route exact path="/decks/:deckId">
            <Deck />
          </Route>

          {/* Add Card Component */}
          <Route exact path="/decks/:deckId/cards/new">
            <CreateCard />
          </Route>

          {/* Edit Card Component */}
          <Route exact path="/decks/:deckId/cards/:cardId/edit">
            <EditCard />
          </Route>

          {/* Not Found 404 Component */}
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default Layout;