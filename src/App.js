import { useState, useEffect } from 'react';
import firebase from './firebase.js';
import './styles/App.scss'
import Examples from './Examples';

function App() {

  const [ manifestations, setManifestations] = useState([]);
  const [ userInput, setUserInput] = useState("");

  const handleUserSelectionToggle = (selection) => {
        console.log(selection)

        const dbRef = firebase.database().ref()

        dbRef.push(selection)
    };

  // use state for firebase value listener 
  useEffect(() => {
    const dbRef = firebase.database().ref();

    dbRef.on('value', (snapshot) => {
      const myData = snapshot.val();
      console.log(myData)

      const newArray = [];

      for (let propertyName in myData) {

      const content = {
        key: propertyName,
        contentBlurb: myData[propertyName]
      }

      newArray.push(content);
    }

    setManifestations(newArray);
    })

  }, [])

  const handleChange = (event) => {
    setUserInput(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const dbRef = firebase.database().ref();
    
    dbRef.push(userInput);

    setUserInput("");
  }

  const handleDelete = (deleteMe) => {
    const dbRef = firebase.database().ref();

    dbRef.child(deleteMe).remove();
  }


  return (
    <div className="App">
      <header>
        <h1> The Manife<span className="station">station</span></h1>
        <h2>a journal for you affirmations</h2>
      </header>
      <p>if you can dream it you can do it</p>

      <Examples handleUserSelectionToggle={handleUserSelectionToggle} />

      <form action="submit" onSubmit={handleSubmit}>
        <label htmlFor="usersManifestation">add your own manifestation here</label>
        <input type="text" 
        placeholder="I am .... I have ... I choose... I attract"
        onChange={handleChange}
      //controlled input react updates the input 
        value={userInput}
        required
        />
        <button>manifest!</button>
      </form>

      <ul>
        {
          manifestations.map((manifestObj) => {
            return (
              <li key={manifestObj.key}>
                <p>{manifestObj.contentBlurb} <span><button onClick={() => handleDelete(manifestObj.key)}>X</button></span></p>
              </li>

            )
          }) 
        }
        <li></li>
      </ul>  
    </div>
  );
}

export default App;
