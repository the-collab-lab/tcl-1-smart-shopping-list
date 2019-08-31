import React, { Component } from "react";
import { FirestoreCollection } from "react-firestore";
import Loading from "./Loading";

class ItemList extends Component {
  render() {
    return (
      <section>
        <FirestoreCollection
          // Specify the path to the collection you're pulling data from
          path="items"
          // Sort the data
          sort="name"
          // isLoading = is a Boolean that represents the loading status for the firebase query. true until an initial payload from Firestore is received.
          // data = an Array containing all of the documents in the collection. Each item will contain an id along with the other data contained in the document.
          render={({ isLoading, data }) => {
            return isLoading ? (
              <Loading />
            ) : (
              <div>
                <ul>
                  {data.map(item => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              </div>
            );
          }}
        />
      </section>
    );
  }
}

// Wrap this componenet in the higher order componenet withFirestore to directly access the database
export default ItemList;
