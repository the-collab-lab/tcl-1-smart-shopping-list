import React, { Component } from "react";
import { withFirestore } from "react-firestore";

class AddItem extends Component {
  state = {
    name: ""
  };

  // Send the new item to Firebase
  addItem = state => {
    let { firestore } = this.props;
  
    firestore
      .collection('items')
      .add({
        name: state.name,
    })
  };

  // Set the state every time an event happens
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  // Handle the click of the Add Item botton on the form
  handleSubmit = event => {
    event.preventDefault();
    this.addItem(this.state);
  };

  // Add Item Form
  render() {
    return (
        <form onSubmit={this.handleSubmit}>
          <label>
              Add Item:
              <input type="text" id="name" onChange={this.handleChange} />
          </label>
          <button onClick={this.handleSubmit}>Add item</button>
        </form>
    );
  }
}

// Wrap this component in the higher order componenet withFirestore to directly access the database
export default withFirestore(AddItem);