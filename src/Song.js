import React, { Component } from 'react';
import { ListGroupItem,Badge,Container, Row, Col,Media  } from 'reactstrap'
import FaSortUp from 'react-icons/lib/fa/chevron-up'

class App extends Component {
  constructor(props) {
    super(props)
    this.voteHandler = this.voteHandler.bind(this)
  }

  voteHandler(){
    this.props.upVoteSong(this.props.index)
  }

  render () {
    return (
      <ListGroupItem className="item-container">
        <Container>
          <Row>
            <Badge className="thumbnail-badge">{this.props.song.votes}</Badge>
            <Col xs="2" className="thumbnail" >
              <img src={this.props.song.track.album.images[2].url} alt=""/>
            </Col>
            <Col xs="8">
              <div className='song-container'>
                <div className="song">
                  <p className="song-title">{this.props.song.track.name}</p>
                  <p className="subdue">{this.props.song.track.artists[0].name}</p>
                </div>
              </div>
            </Col>
            <Col xs="2">
              <div className="icon" onClick={this.voteHandler}>
                <FaSortUp className="icon subdue" style={{color:this.props.song.voted ? "#2ecc71":"#A4A5A5"}}/>
              </div>
            </Col>
          </Row>
        </Container>
      </ListGroupItem>
    );
  }

}

// <p className="align-middle song-badge">
//   <Badge pill>{this.props.song.votes}</Badge>
// </p>


export default App;
