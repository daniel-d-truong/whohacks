import React from "react";
import './video.css';

/* We simply can use an array and loop and print each user */
const VideoPage = () => {
  return (
    <div>
        <div className="Videos">
            {/* <div className="d-flex flex-row">
                <div className="video_item">hello</div>
                <div className="video_item">hello</div>
                <div className="video_item">hello</div>
                <div className="video_item">hello</div>
            </div> */}
            <Container>
              <Row>
                <Col></Col>
                <Col></Col>
              </Row>
            </Container>
        </div>
      <div className="Messages">

      </div>
    </div>
  );
};

export default VideoPage;