import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ListGroup, ListGroupItem, Badge,Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,Container, Row, Col,Media  } from 'reactstrap'
import FaSortUp from 'react-icons/lib/fa/chevron-up'
import Spotify from 'spotify-web-api-js'
import Song from './Song.js'
import firebase from 'firebase'

class App extends Component {
  constructor(props) {
    super(props)

    this.toggleNavbar = this.toggleNavbar.bind(this);

    this.state = {
      songs: [],
      start: Date.now(),
      currentSong:null,
      currentPosition: 0,
      percentage:0,
      collapsed: true
    }

    this.timer = null;
    this.spotify = new Spotify()
    this.spotify.setAccessToken('BQANgA8idyh3qvXOSlX30qv2RBwvUreBkf9dva0mL_0_v3Y4VthfHvnRhimdf-2jfl7cyh0UuNkPC9exjgjIp3xbUSPRy71nfJXEDgsVVxSPYud7WDuZxLI2-jxtYfxEruHu1EolYCQcmhmPG1Vgqm61gzz86TFrYiFa-JTcpo61vV2Mv2cqHo_SjtMV28GvAJGf0q5WfuYUNGiTJzxyzqR0kq0YyWr07BScWeiuI8Gc-9Hg_7KjWDW2QMn8aeKTMuOqOFOBAQ');
    this.upVoteSong = this.upVoteSong.bind(this)
    firebase.initializeApp({
      apiKey: 'AIzaSyCOcFRsrjB3Nywt2NhOaBzktEKlw9oQw3U',
      projectId: 'spotify-rooms-47b2d'
    });
    this.db = firebase.firestore();
    this.db.settings({timestampsInSnapshots: true});
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount(){
    const tick = () => {
      this.setState({
        currentPosition: Date.now() - this.state.start + (0)
      });
    }


    this.timer = setInterval(tick, 300);
    
    this.db.collection('/rooms/0/queue')
      .onSnapshot((snapshot) => {
        console.log(snapshot)
        var songs = snapshot.docs.map((song) => {
          console.log(song.ref)
          return song.data()
        })
        console.log(songs);

        this.setState({songs,currentSong:songs[3].track})  
        this.playSongs()
        console.log(songs)
      },(err) => {
        console.log(err)
      })
      


  }

  playSongs(){
    var track = this.state.songs[0].track;


    this.spotify.play({
      context_uri:track.album.uri,
      offset:{
        position:track.track_number - 1
      }
    },(error,second) => {
      if(error == null) {
        this.setState({
          start:Date.now(),
          currentPosition:0
        })

        this.state.songs.shift()
        var songs = this.state.songs

        this.setState({currentSong:track,songs})
        setTimeout(() => {
          this.playSongs()
        }, 10000 );
      }
    })
  }

  upVoteSong(index){
    var songs = this.state.songs;

    songs[index].voted = true;
    songs[index].votes +=1;

    this.setState({songs:this.sortQue(songs)})
    console.log(this.state.songs)
  }


  renderSongs(){
    return this.state.songs.map((song,index) => (
      <Song song={song} upVoteSong={this.upVoteSong} index={index} key={index}/>
    ));
  }

  sortQue(songs) {

    var minIdx, temp, len = songs.length;


    for(var i = 0; i < len; i++){
      minIdx = i;

      for(var j = i+1; j < len; j++){

         if(songs[j].votes > songs[minIdx].votes){
            minIdx = j;
         }
      }

      temp = songs[i];
      songs[i] = songs[minIdx];
      songs[minIdx] = temp;
    }

    return songs;

  }

  renderCurrentSong(){
    if(this.state.currentSong){
      const percentage = (this.state.currentPosition * 100 / this.state.currentSong.duration_ms).toFixed(2) + '%';

      let artists = this.state.currentSong.artists.map((artist) => {
        return artist.name
      })

      return (
        <ListGroup className="group sticky" >
          <ListGroupItem className="item-container">
            <Container>
              <Row>
                <Col xs="2" className="thumbnail current-thumbnail" >
                  <img src={this.state.currentSong.album.images[2].url} alt=""/>
                </Col>
                <Col xs="8">
                  <div className='song-container'>
                    <div className="song">
                      <p className="song-title">{this.state.currentSong.name}</p>
                      <p className="subdue">{this.state.currentSong.artists[0].name}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </ListGroupItem>
          <div className="song-duration-background">
            <div className="song-duration" style={{ width: percentage }}>
            </div>
          </div>
        </ListGroup>
      )
    }
  }

  render() {
    return (
      <div className="app">
        <div>
          <Navbar id="header" className="fixed-top" color="faded" light>
            <NavbarBrand href="/" className="mr-auto">reactstrap</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse isOpen={!this.state.collapsed} navbar>
              <Nav navbar>
                <NavItem>
                  <NavLink href="/components/">Components</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>

        <ListGroup className="group songs-list" flush>
          { this.renderSongs() }
        </ListGroup>
        { this.renderCurrentSong() }
      </div>
    );
  }
}

export default App;
