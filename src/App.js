import './App.css';
import React, {useState} from 'react'

function App() {

  const [data, setData] = useState([])
  const [location, setLocation] = useState("");
  const [terms, setTerms] = useState("");
  const [searching, setSearching] = useState(false);

  async function fetchJobs(event){
    setSearching(true)
    event.preventDefault();

    // let url = 'https://jobsearchwebscraper.josiahsprankle.repl.co/?';
        let url = '/?';


    url += 
      location && terms ? `location=${location}&terms=${terms}` :
      location && !terms ? `location=${location}` :
      terms && !location ? `terms=${terms}` : 
      "";
    try {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
      setSearching(false);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
      <form onSubmit={fetchJobs}>
      <h1><i class="fas fa-layer-group"></i>&nbsp; My Job Search</h1>
      
        <div className="form-control">
            <label htmlFor="terms">Search terms, skills, or jobs.</label>
            <input onInput={(e)=>setTerms(e.target.value)} id="terms" type="text" placeholder="Your terms here"/>
        </div>
        <div className="form-control">
          <label htmlFor="location">Search jobs by location</label>
            <input onInput={(e)=>setLocation(e.target.value)}  id="location" placeholder="You location here" type="text"/>
        </div>
        {!searching && <button type="submit"><i class="fas fa-search"></i> Search Jobs</button>}
        {searching && <button disabled type="submit"><i class="fas fa-compass spin-icon"></i> <span className="fading">Searching...</span></button>}
        
      </form>
      <p className="description"><i class="fas fa-info-circle"></i>&nbsp; Get instant results from companies such as Indeed, Flexjobs, and SimplyHired!</p>
      <div className="loading-spinner">

      </div>
      {!searching &&
      <main className="fade-in">
       {[...data].map(job=>{
          return(
            <div className="job-container">
              <h2 className="job-title">{ job.title }</h2>
              <div>
                <span className="job-company">{ job.company }</span> 
              </div>
              <p className="job-description">{ job.description }</p>
              <div>
                {job.salary && <em className="job-salary">{ job.salary || "" }</em>  }
              </div>
              <a rel="noreferrer" target="_blank" href={job.link}>View Job</a>
            </div>
          )
        })}
      </main>
      }
       
    </div>
  );
}

export default App;
