import React from "react";
import Message from '../components/message';
import styled from "styled-components";
import './video.css';
import profilepic from "../images/welcome_icon.png";

export const Grid = styled.div` 

`;

export const Row = styled.div`
  display:flex;
  margin-bottom:5%;
`;

export const Col = styled.div`
  display:${(props) => props.size};
  margin-right:10%;
`;

/* We simply can use an array and loop and print each user */
const VideoPage = () => {
  return (
    <Row>
      <Col size = {1}>

        <div className="Videos">
            <Grid>
              <Row>
                <Col size = {1}>
                  <div className="video_item"></div>
                </Col>
                <Col size = {1}>
                  <div className="video_item"></div>
                </Col>
              </Row>
              <Row>
                <Col size = {1}>
                  <div className="video_item"></div>
                </Col>
                <Col size = {1}>
                  <div className="video_item"></div>
                </Col>
              </Row>
            </Grid>
        </div>
        </Col>
        <Col size = {1}>
      <div className="Messages">
        {dummy_test.map(item => (
          <div key={item.id}><Message transcript={item.transcript} name={item.name} image={profilepic}></Message></div>
        ))}
      {/*<Message id="test1" transcript="Ivy is my friend!" name="Daniel T." image={profilepic}></Message>
      <Message id="test1" transcript="I'm giving Ivy my dog!" name="Trisa L." image={profilepic}></Message>
      <Message id="test1" transcript="I SAID WHOEVER THREW THAT PAPER YOUR MUMS A HOE" name="You!" image={profilepic} isUser></Message>
  <Message id="test1" transcript="I'm gonna take ketchup shots!" name="Garret L." image={profilepic}></Message>*/}
      </div>
      </Col>
    </Row>
  );
};

const dummy_test = [
  {
      "id": "test1",          //ID
      "transcript": "Ivy is my friend!",  // actual message text
      "name": "Daniel T."         // name of person speaking
  },
  {
    "id": "test2",          //ID
    "transcript": "I'm giving Ivy my dog!",  // actual message text
    "name": "Trisa L."         // name of person speaking
  },
  {
    "id": "test3",          //ID
    "transcript": "I SAID WHOEVER THREW THAT PAPER YOUR MUMS A HOE",  // actual message text
    "name": "Ivy C."         // name of person speaking
  },
  {
    "id": "test4",          //ID
    "transcript": "I'm gonna take ketchup shots!",  // actual message text
    "name": "Garrett L."         // name of person speaking
  },
  {
    "id": "test5",          //ID
    "transcript": "Actually, Ivy is my BEST friend",  // actual message text
    "name": "Daniel T."         // name of person speaking
  },
  {
    "id": "test6",          //ID
    "transcript": "I'm gonna buy Ivy another dog!",  // actual message text
    "name": "Trisa L."         // name of person speaking
  },
  {
    "id": "test7",          //ID
    "transcript": "I'M GETTING MORE KETCHUP",  // actual message text
    "name": "Garrett L."         // name of person speaking
  }
];

export default VideoPage;