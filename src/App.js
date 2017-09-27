import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import firebase from './firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      text: '',
      messageTime: '',
      items: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.username
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: ''
    });
  }
  componentDidMount() {
    const itemsRef = firebase.database().ref('users');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];      
      for (let item in items) {
        for (let msgs in items[item].messages) {
          let obj = items[item].messages[msgs];
          newState.push({
            id: item,
            time: obj.time,
            title: obj.text,
            user: obj.name
          });
        }
      }
      this.setState({
        items: newState
      });
    });
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className='app'>
        <header>
            <div className="wrapper">
              <h1>Respond to mesages</h1>      
            </div>
        </header>
        <div className='container'>

          <div className='display-item'>
              <div className="wrapper">
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      <Grid key={item.id}>
                        <Row className="show-grid">
                        <Col xs={1} md={1}><input type="radio" value="{item.id}" /></Col>
                        <Col xs={8} md={3}>{item.title}</Col>
                        <Col xs={3} md={3}>sent by: {item.user}</Col>
                        </Row>
                      </Grid>
                    )
                  })}
                </ul>
              </div>
          </div>
          <div></div>
          <div className='add-item'>
      
                <Form horizontal  onSubmit={this.handleSubmit}>
                  <FormGroup controlId="formControlsTextarea">
                    <ControlLabel>Textarea</ControlLabel>
                    <FormControl componentClass="textarea" name="currentItem" placeholder="textarea" onChange={this.handleChange} value={this.state.currentItem}/>
                  </FormGroup>
                  <Button bsStyle="primary" bsSize="small">Reply</Button>
                </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
