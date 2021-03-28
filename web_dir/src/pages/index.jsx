import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import bigboiscreens from '../images/bigboiscreens.png';
import placeholderchat from '../images/placeholderchats.png';
import './index.css';

export const Grid = styled.div` 

`;

export const Row = styled.div`
  display:flex;
  padding:5%;
  text-align:center;
`;

export const Col = styled.div`
  display:${(props) => props.size};
  margin-right:10%;
`;

class MainPage extends React.Component {
  render() {
    return (
      <div>      
        <Grid>
          <Row>
            <Col size = {2}>
                <div className="bigboiscreens">
                  <img src={bigboiscreens} className="bigboiscreens"/>
                </div>
            </Col>
            <Col size = {1}>
                <div className="placeholderchat">
                  <img src={placeholderchat} className="placeholderchat"/>
                </div>

                <h1 className="app_name">blender</h1>
                <h2 className="tagline">converse confidently.</h2>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
};

export default MainPage;