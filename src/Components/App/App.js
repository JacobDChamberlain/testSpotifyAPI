import React from 'react';
import './App.css';

function App() {
  const CLIENT_ID = 'a38b9678db4e4465988e4cacac35e34b';
  const REDIRECT_URI = 'http://localhost:3000';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';

  return (
    <div className="App">
      <header className='app-header'>

      </header>
      <a href={ `${ AUTH_ENDPOINT }?client_id=${ CLIENT_ID }&redirect_uri=${ REDIRECT_URI }&response_type=${ RESPONSE_TYPE }` }>
        Login to Spotify
      </a>
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