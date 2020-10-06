import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import Navigation from './Components/Navigation';
import Logo from './Components/Logo';
import ImageLinkForm from './Components/ImageLinkForm';
import Rank from './Components/Rank';
import FaceRecognition from './Components/FaceRecognition';

import Signin from './Components/Signin'
import Register from './Components/Register'


const app = new Clarifai.App({
  apiKey: '07b4b83041ba4680aa42cfc39b5c85d4'
})

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

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
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
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(res => this.displayFaceBox(this.calculateFaceLocation(res)))
      .catch(err => console.log(err));
  }

  onRouteChange = (r) => {
    if (r === 'signout') {
      this.setState({ isSignedIn: false })
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
          <Register onRouteChange={this.onRouteChange} /> :
          route === 'home' ?
            <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
              <FaceRecognition imageUrl={imageUrl} box={box} />
            </div> :
            <Signin onRouteChange={this.onRouteChange} />}
      </div>
    );
  }
}

export default App;
