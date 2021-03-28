import React from "react";
import styled from "styled-components";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import profile_image from '../images/profile_image.png';
import './profile.css';
/* We simply can use an array and loop and print each user */

export const Grid = styled.div` 

`;

export const Row = styled.div`
  display:flex;
  margin-top:5%;
`;

export const Col = styled.div`
  display:${(props) => props.size};
  margin-right:10%;
`;

const ProfilePage = () => {
  return (
    <div className="profile">
      <Grid>
      <Row>
          <div className="profile_text">
            welcome, [user]!
          </div>
        </Row>
        <Row>
          <div className="profile_image">
            <img src={profile_image} className="profile_image"/>
          </div>
        </Row>
        <Row>
          <div className="profile_text">
            <Button bsPrefix="custom-button" onClick={() => { alert('clicked') }}>
              create room
            </Button>
          </div>
        </Row>
        <Row>
          <div className="profile_text">
            <Button bsPrefix="custom-button" onClick={() => { alert('clicked') }}>
              join room
            </Button>
          </div>
        </Row>
      </Grid>
    </div>
  );
};

export default ProfilePage;