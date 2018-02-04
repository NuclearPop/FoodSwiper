import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      counter: 0,
      pref: [],
      user_id: 'None',
    };
    this.onSubmit = this.handleSubmit.bind(this);
  }

  // Calls API to SQL

  componentDidMount() {
    this.callApi('getfood')
      .then(res => this.setState({ items: this.addNewData(res.express) }))
      .catch(err => console.log(err));
  }

  async callApi(value) {
    var response = await fetch('/api/'+value);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  handleSubmit(e) {
    e.preventDefault();
    // On submit of the form, send a POST request with the data to the server.
    console.log(this.refs.name.value)
    fetch('/api/check_account', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "name": this.refs.name.value,
          "password": this.refs.password.value
        })
      })
      .then(function(response) {
        return response.json()
      }).then(res => this.setState({ user_id: res.express[0]['acct_id']}));
  }

  async check_account(e) {
    e.preventDefault();
    var response = await fetch('/api/check_account', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "name": this.refs.name.value,
          "password": this.refs.password.value
        })
      });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div>
        <h1>{this.state.items[this.state.counter]}</h1>
        <button onClick={() => this.clicked(1)}>Yes</button>
        <button onClick={() => this.clicked(0)}>No</button>
        <h1>{this.state.pref}</h1>
        <button onClick={() => this.refresh('getfood')}>Refresh</button>
        <h1>Current User: {this.state.user_id}</h1>
        <form onSubmit={this.onSubmit}>
          <input type="text" placeholder="Name" ref="name"/>
          <input type="text" placeholder="Password" ref="password"/>
          <input type="submit" />
        </form>
      </div>
    );
  }

  clicked(r) {
    if (this.state.counter < this.state.items.length) {
      if (r == 1) {
        this.setState({ pref: this.state.pref + this.state.items[this.state.counter] + ', '});
      }
      this.setState({ counter: this.state.counter + 1})
    }
  }

  async refresh_id() {
    this.check_account()
      .then(res => this.setState({ user_id: res.express[0]['acct_id']}))
      .catch(err => console.log(err));
  }

  async refresh(item) {
    this.callApi(item)
      .then(res => this.setState({ items: this.addNewData(res.express) }))
      .catch(err => console.log(err));
  }


  addNewData(newData) {
    var newList = this.state.items.slice();
    for (var i=0; i<newData.length; i++) {
      newList.push(newData[i]['food_name']);
    }
  return newList
  }
}
export default App;
