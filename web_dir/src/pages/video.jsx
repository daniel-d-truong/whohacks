import React, { useEffect, useState } from "react";
import Message from '../components/message';
import styled from "styled-components";
import './video.css';
import profilepic from "../images/welcome_icon.png";

import { Client, LocalStream, RemoteStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';

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
const VideoPage = (props) => {
  const [messages, setMessages] = useState([]);

  const [streams, setStreams] = useState([]);

  useEffect(() => {
    // join a room? yeee
    const signal = new IonSFUJSONRPCSignal("wss://ion-sfu:7000");
    const client = new Client(signal);
    signal.onopen = () => client.join(props.roomId, props.name)

    client.ontrack = (track, stream) => {

      // might need to filter if stream already exists
      setStreams((old) => [...old, stream]);
    }

    client.ondatachannel = (ev) => {
      // read from datachannel and parse message and add message
      ev.channel.onmessage = ({ data }) => {
        let decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
        // msg is the object we need
        let msg = JSON.parse(decodedString);
        // append to array?
        setMessages((old) => [...old, msg]);
      }
    }

  }, []);

  useEffect(() => {
    // if the last message is the same id as the previous message,
    // take the last message to be precendent
    if (messages[messages.length - 1].id === messages[messages.length - 2].id) {
      // copy array
      let newMessages = messages.slice();
      // delete the stuff
      newMessages.splice(messages.length - 2, 1);
      // reassign
      setMessages(newMessages);
    }
  }, [messages]);

  return (
    <Row>
      <Col size = {1}>
        <div className="Videos">
            <Grid>
              <Row>
                {streams.map((stream) => 
                  <video src={stream}/>
                )}
                {/* <Col size = {1}>
                  <div className="video_item"></div>
                </Col>
                <Col size = {1}>
                  <div className="video_item"></div>
                </Col> */}
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
        {messages.map(item => (
          <div key={item.id}><Message transcript={item.transcript} name={item.name} image={profilepic}/></div>
        ))}
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