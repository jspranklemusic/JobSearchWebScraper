const cheerio = require('cheerio');
const axios = require('axios').default;
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static('build'));

class JobSearchObject{
  constructor(url, query, container, title, company, salary, description,link){
    this.jobs = [];
    this.url = url;
    this.query = query;
    this.container = container;
    this.title = title;
    this.company = company;
    this.salary = salary;
    this.description = description;
  }
  async populateObject(){
    const response = await axios.get(this.url+this.query)
    const $ = cheerio.load(response.data);

    console.log($(this.container).text())

    $(this.container).each((ind,item)=>{
      const html = $(item).html();
      const $$ = cheerio.load(html);
      this.jobs.push({
        title:$$(this.title) ? $$(this.title).text().replace(/\n/g,'') : null,
        link:this.url + $$('a').attr("href"),
        company:$$(this.company) ? $$(this.company).text().replace(/\n/g,'') : null,
        salary:$$(this.salary) ? $$(this.salary).text().replace(/\n/g,'') : null,
        description:$$(this.description) ? $$(this.description).text().replace(/\n/g,'') : null
      })
    })
    return this.jobs;
  }
}

app.get('/',(req,res)=>{
    res.sendFile('index.html');
})

app.get('/api',async (req,res)=>{

  const location = req.query.location || "remote";
  const terms = req.query.terms || "react";

  const Indeed = new JobSearchObject(
        url = "https://www.indeed.com",
        query = `/jobs?q=${terms}&l=${location}`,
        container='.jobsearch-SerpJobCard',
        title=".jobtitle",
        company=".company",
        salary=".salaryText",
        description=".summary"
    )
    const Flexjobs = new JobSearchObject(
      url="https://www.flexjobs.com",
      query=`/search?search=&search=${terms}&location=${location}`,
      container='li.list-group-item.job',
      title='a.job-link',
      company='',
      salary='',
      description='div.job-details'
    )

    const SimplyHired = new JobSearchObject(
      url="https://www.simplyhired.com",
      query=`/search?q=${terms}&l=${location} `,
      container="article",
      title=".jobposting-title",
      company=".jobposting-company",
      salary=".jobposting-salary",
      description=".jobposting-snippet"
    )
  
    const indeedJobs = await Indeed.populateObject();
    const flexjobsJobs = await Flexjobs.populateObject();
    const simplyhiredJobs = await SimplyHired.populateObject();

    
    res.json([...indeedJobs,...flexjobsJobs,...simplyhiredJobs]);
})

app.listen(PORT, ()=>{
  console.log("listening on port: " + PORT + "")
})




