import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';

import Navigation from './Components/Navigation';
import Logo from './Components/Logo';
import ImageLinkForm from './Components/ImageLinkForm';
import Rank from './Components/Rank';
import FaceRecognition from './Components/FaceRecognition';

import Signin from './Components/Signin'
import Register from './Components/Register'


const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 200
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    password: '',
    email: '',
    entries: 0,
    joined: '',
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }
  loadUser = (u) => {
    this.setState({
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        entries: u.entries,
        joined: u.joined,
      }
    })
  }
  calculateFaceLocation = (data) => {

    const image = document.getElementById('inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (b) => {
    this.setState({ box: b })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }
  onSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    fetch('https://radiant-harbor-60454.herokuapp.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(res => {
        if (res) {
          fetch('https://radiant-harbor-60454.herokuapp.com:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
        }
        console.log(res)
        this.displayFaceBox(this.calculateFaceLocation(res))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (r) => {
    if (r === 'signout') {
      this.setState(initialState)
    } else if (r === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: r })
  }
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles params={particleOptions} className="particles" />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'register' ?
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> :
          route === 'home' ?
            <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
              <FaceRecognition imageUrl={imageUrl} box={box} />
            </div> :
            <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />}
      </div>
    );
  }
}

export default App;
