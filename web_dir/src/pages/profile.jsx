import React from "react";
import styled from "styled-components";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import profile_image from '../images/profile_image.png';
import './profile.css';
import { BrowserRouter as Router, Link} from "react-router-dom";

export const Grid = styled.div` 

`;

export const Row = styled.div`
  display:flex;
  margin-top:10%;
  padding:5%;
  text-align:center;
`;

class ProfilePage extends React.Component {
  constructor() {
    super();

    this.state = {
      isSubmitted: false,
      name: "",
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
  }

  handleNameInput = (e) => {
    this.setState({name: e.target.value});
    console.log(e.target.value);
  }

  handleSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault();

    this.setState({
      isSubmitted: true,
    })

    this.props.history.push('/video');
  };

  render () {
    return (
      <div className="profile">
        <Grid>
        <Row>
            <div className="profile_text">
              welcome {this.state.isSubmitted ? this.state.name : null} !!
            </div>
          </Row>
          <Row>
            <div className="profile_image">
              <img src={profile_image} className="profile_image"/>
            </div>
          </Row>
          <Row>
            <form onSubmit={this.handleSubmit} noValidate>
              <label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="your name here" 
                  onChange={(e) => this.handleNameInput(e)}
                  required/>
              </label>
              <button>get started</button>
            </form>
          </Row>
        </Grid>
      </div>
    );
  }
};

export default ProfilePage;