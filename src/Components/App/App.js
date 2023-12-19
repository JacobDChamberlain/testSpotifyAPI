import React, { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import axios from 'axios';
import './App.css';

function App() {
  const CLIENT_ID = 'a38b9678db4e4465988e4cacac35e34b';
  const REDIRECT_URI = 'http://localhost:3000';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  const authenticationURL = `${ AUTH_ENDPOINT }?client_id=${ CLIENT_ID }&redirect_uri=${ REDIRECT_URI }&response_type=${ RESPONSE_TYPE }`;

  const albumId = '5s208wsEJfmf57Wn0gSeLk';


  const [ token, setToken ] = useState('');
  const [ searchKey, setSearchKey ] = useState('');
  const [ artists, setArtists ] = useState([]);
  const [ album, setAlbum ] = useState({});
  const [ tracks, setTracks ] = useState([]);


  useEffect( () => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem( 'token' );

    if ( !token && hash ) {
      token = hash.substring(1).split('&').find( elem => elem.startsWith( 'access_token' ) ).split('=')[1];

      window.location.hash = '';
      window.localStorage.setItem( 'token', token );
    }


    const fetchAlbumData = async () => {
      const { data } = await axios.get( `https://api.spotify.com/v1/albums/${ albumId }`, {
        headers: {
          Authorization: `Bearer ${ token }`
        }
      } );

      setAlbum( data );
    }

    const fetchAlbumTracks = async () => {
      const { data } = await axios.get( `https://api.spotify.com/v1/albums/${ albumId }/tracks`, {
        headers: {
          Authorization: `Bearer ${ token }`
        }
      } );

      setTracks( data );
    }

    fetchAlbumData()
      .catch( console.error );

    fetchAlbumTracks()
      .catch( console.error );

    setToken( token );
  }, [] );


  const logout = () => {
    setToken('');
    window.localStorage.removeItem( 'token' );
  }


  const searchArtists = async (e) => {
    e.preventDefault();

    const { data } = await axios.get( 'https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${ token }`
      },
      params: {
        q: searchKey,
        type: 'artist'
      }
    } );

    setArtists( data.artists.items );
  }


  const renderArtists = () => {
    return artists.map( artist => (
      <div className='artist-result' key={ artist.id }>
        { artist.images.length ?
          <img className='artist-result-image' width={'50%'} src={ artist.images[0].url } alt={ `Spotify artist images for ${ artist.name }.` } />
          : <div>No Image</div> }
        { artist.name }
      </div>
    ))
  };


  const renderAlbum = () => {
    // console.log( 'album data: ', album );

    return (
      <div className='album-data-wrapper'>
        <div className='album-info'>
          Band: { album.artists[0].name }<br/>
          Title: { album.name }<br/>
          Release Date: { album.release_date }<br/>
          Images: { album.images.map( image => (
            <img key={ image.url } src={ image.url } alt={ `${album.artists[0].name} images from Spotify` } />
          ))}
          URL: { album.href }<br/>
        </div>

        <ul className='album-data-keys'>
          { Object.keys( album ).map( key => (
            <li key={ key }>{ key }</li>
          ) ) }
        </ul>
      </div>
    )
  }


  const renderTracks = () => {
    console.log( 'tracks: ', tracks )
    return tracks.items.map( item => (
      <li key={ item.id }>
        { item.name }
        <ReactAudioPlayer
          src={ item.preview_url }
          // autoPlay
          controls
        />
      </li>
    ))
  }


  return (
    <div className="App">
      <header className='app-header'>
        <h1>Spotify React</h1>
        { !token ?
          <a href={ authenticationURL }>Login to Spotify</a>
          : <button onClick={ logout }>Logout</button>
        }
      </header>

      <form onSubmit={ searchArtists }>
        <input name='search-input' type='text' onChange={ e => setSearchKey( e.target.value ) } />
        <button type={'submit'}>Search</button>
      </form>

      { album.name && renderAlbum() }

      { tracks.items &&  renderTracks() }

      { renderArtists() }
    </div>
  );
}

export default App;



// Authentication
// To be able to use the API, the user needs to be authenticated with his Spotify Account.
// For that case we need to create a link which leads us to the Spotify Authentication/Login page.

// A hash is passed to the URL
// which contains the access token
// which we need to authorize the API calls.


// Access Token:
// As we want to check for the token as soon as we come back,
// we use the useEffect from react.

// Then we check the URL for the hash and extract the token.

// After that we store the token in a state variable with useState
// as well as save the token in our local Storage.


//* Consider making a useEffect to log into my account with my credentials
//* to make this work on page load when Maldevera website is live.


// Fetch data using Axios with Bearer and token
// Display info
// ? Use the API Documentation to learn what all data I can retrieve!
// * Learn how to get audio data to play songs!! :D! You can do it!