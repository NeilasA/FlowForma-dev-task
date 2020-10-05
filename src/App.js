import React, { useState, useEffect } from 'react';
import './App.css';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

function App() {

  useEffect(() => {
    fetchData();
  }, []);
  
  const classes = makeStyles();
  const [names, setNames] = useState([]);
  const [tech, setTech] = useState([]);
  const [ageArr, setAgeArr] = useState([]);
  const [loading, setLoading] = useState(false);

  
  
  const fetchData = async () => {
    const nameData = await fetch('http://78.63.13.74:3006/FlowFormaAPI/names');
    const names = await nameData.json();
    const techData = await fetch('http://78.63.13.74:3006/FlowFormaAPI/tech');
    const tech = await techData.json();

    let people = {
      Names: names,
      Tech: tech,
      Age: []
    }

    await Promise.all(names.map(async (name, index) => {
      const dateOf = await fetch(`http://78.63.13.74:3006/FlowFormaAPI/getdate/${name}`);
      const dateJson = await dateOf.json();
      const dod = dateJson.Death;
      const dob = dateJson.Birth;

      if (dod == null) {
        const date1 = new Date(dob);
        const today = new Date();
        const age = Math.floor((today - date1) / (31557600000));
        console.log(`${age} - ${index}`);
        people.Age[index] = age;
      } else {
        const date1 = new Date(dob);
        const date2 = new Date(dod);
        const age = Math.floor((date2 - date1) / 31557600000);
        console.log(`${age} - ${index}`);
        people.Age[index] = age;
      }

      setNames(names);
      setTech(tech);
      setAgeArr(people.Age);
    }));

    setLoading(true);
  }

  return (
    <div className="App">
      <h1>Name</h1>
      <h1>Tech</h1>
      <h1>Age</h1>
      <div className="name">
        {names.map(name => (
          <p>{name}</p>
        ))}
      </div>
      <div className="techName">
        {tech.map(techName => (
          <p>{techName}</p>
        ))}
      </div>
      <div className="age">
        {ageArr.map(ageArrAge => (
          <p>{ageArrAge}</p>
        ))}
      </div>

      <div>
        {loading ? loading : <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>}
      </div>
    </div>
  );
}

export default App;
