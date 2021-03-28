import React from "react";
import styled from "styled-components";
import './video.css';

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

/* We simply can use an array and loop and print each user */
const VideoPage = () => {
  return (
    <div>
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
      <div className="Messages">

      </div>
    </div>
  );
};

export default VideoPage;