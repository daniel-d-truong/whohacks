import React from "react";
import styled from "styled-components";
import 'bootstrap/dist/css/bootstrap.min.css';
import profile_image from '../images/profile_image.png';
import './profile.css';
import { BrowserRouter as Router, Link} from "react-router-dom";

export const Grid = styled.div` 
  display: flex;
  flex-direction: column;
  align-items: center;
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
      room: "",
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
  }

  handleNameInput = (e) => {
    this.setState({name: e.target.value});
  }

  handleRoomInput = (e) => {
    this.setState({room: e.target.value});
  }

  handleSubmit = formSubmitEvent => {
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
          <div className="profile_image">
            <img alt="Profile" src={profile_image} className="profile_image"/>
          </div>
          <div className="input-form">
            <input 
              className="input-field flex-item"
              type="text" 
              placeholder="your name here" 
              onChange={this.handleNameInput}
              required/>
            <input
              className="input-field flex-item"
              type="text"
              placeholder="room code"
              onChange={this.handleRoomInput}
              required/>
            <Link to={{
              pathname: "/video",
              state: {
                name: this.state.name,
                room: this.state.room,
              }
            }} className="get-started flex-item">Get started!</Link>
          </div>
        </Grid>
      </div>
    );
  }
};

export default ProfilePage;