// 6281a218 -> API Key
//with js we can use various ways to make requests
//we are going to be using axios 

const autoCompleteConfig = {
  renderOption(movie){
    const imgSrc = movie.Poster === 'N/A'?'':movie.Poster;
    return`
    <img src = "${imgSrc}"/>
    ${movie.Title} (${movie.Year})
   `;
  },
 
  inputValue(movie){
    return movie.Title;
  },
  async fetchData(searchTerm)  {
    
    
    let i="tt0848228"
    let search = searchTerm
    const response = await axios.get(`http://www.omdbapi.com/?s=${search}&apikey=6281a218`);
    
    if(response.data.Error){
        return [];
    }
    return response.data.Search;
}
};


createAutoComplete({
  ...autoCompleteConfig,
  root:document.querySelector('#left-autocomplete'),
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie,document.querySelector('.left-summary'),'left');
    
  },
  
});
createAutoComplete({
  ...autoCompleteConfig,
  root:document.querySelector('#right-autocomplete'),
  onOptionSelect(movie){
    
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie,document.querySelector('.right-summary',),'right'); 
    
  },
})

// const root = document.querySelector('.autocomplete');

// root.innerHTML = `
//     <label><b>Search for a Movie</b></label>
//     <input class = "input"/>
//     <div class = "dropdown">
//         <div class = "dropdown-menu">
//             <div class = "dropdown-content results"></div>
//         </div>
//     </div>
// `;
// const input = document.querySelector('input');
// const dropdown = document.querySelector('.dropdown');
// const resultsWrapper = document.querySelector('.results');



// // ~input.addEventListener('input', (event) =>{
//     //^this line will take the input and fetch the data from the api based of the input value but thats kind off too much coz we would make request for every single letter that we will type in the input and that would eat up a lot of our api requests(since we only have like 1000 requests/day), so what we do here is we will make sure that the data is fetched when user has stopped typing for a little bit of time (like 0.5 seconds or so )
//     //~ fetchData(event.target.value)


//?let timeoutId;
//?const onInput = event => {
//?    //debouncing an input, great process when we want to wait for a function to run only after centain event conclude
//?    if(timeoutId){
//?        clearTimeout(timeoutId);//->TIMEOUTiD UNDECLARED
//?        console.log('timeout was cleared')
//?    }
//?    timeoutId = setTimeout(()=>{
//?        console.log('hi')
//?        fetchData(eventimeoutIdt.target.value)
//?    },1000);
//?}
// //onInput holds a reference to function returned by debounce
// const onInput =  debounce(async (event)=>{
    
//     //^this function below is retu   rning us the movies array from api
//    const movies =  await fetchData(event.target.value);
//    if(!movies.length){
//        dropdown.classList.remove('is-active');
//    }
//    else{
//    dropdown.classList.add('is-active')}
//    //clearing the resultsWrapper whenver something new is typed
//    resultsWrapper.innerHTML = '';
//     for( let movie of movies){
//         //^we will iterate through movies and create a div for each movie which will contain the title and poster of that movie, though we are getting error on an invalid input but we resolved it using if(response.data.Error)->return [](empty array);

//         const option = document.createElement('a');
//         const imgSrc = movie.Poster == 'N/A'?'':movie.Poster;
//         //adding the dropdown contents 
//         option.classList.add('dropdown-item')
//         //using innerHTML
//         option.innerHTML = `
//            <img src = "${imgSrc}"/>
//            ${movie.Title}
//         `;
//         //click on movie->removing the dropdown and replacing input value with movie title
//         option.addEventListener('click', ()=>{
//             input.value = movie.Title;
//             dropdown.classList.remove('is-active');
//              onMovieSelect(movie);
//             // do another request
//             //get data
//             //render data
        
           
//         })
//         resultsWrapper.appendChild(option);
//     }
// })
// //^one of the good practice to write websites is to limit coupling between html and javascript.If we depend less on our markup for structuring and do structuring flexibly with javascirpt, it would be much more intuitive and nicer.So lets do it
// input.addEventListener('input',onInput);
// document.addEventListener('click', event => {
    
//     if(!root.contains(event.target)){
//         //if not clicked within root -> close the dropdown
//         dropdown.classList.remove('is-active')
//     }
// });
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie,summaryElement,side) =>{
    
    //we use the imdbID of movie object and make a request to get data about movie
    const response = await axios.get(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=6281a218`);
    console.log(response.data);
    summaryElement.innerHTML = movieTemplate(response.data);
  if(side == 'left'){
    leftMovie = response.data;
  }
  else{
    rightMovie = response.data;
  }

  if(leftMovie && rightMovie){
    runComparison();
  }
};

const runComparison = () => {
  console.log('comparision')
  const leftSideStats = document.querySelectorAll(
    '.left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll(
    '.right-summary .notification'
  );
 
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
 
    const leftSideValue = parseFloat(leftStat.dataset.value); // <------ BAD
    const rightSideValue = parseFloat(rightStat.dataset.value); // <------ BAD

    
    if(rightSideValue > leftSideValue){
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
     
    }
    else if (rightSideValue < leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      leftStat.classList.remove('is-primary');
      rightStat.classList.remove('is-primary');
      leftStat.classList.add('is-success');
      rightStat.classList.add('is-success');
    }
  });
};


const movieTemplate = (movieDetail) => {
//->since we are using dollar sign so we have to escape it since its a keyword
console.log(movieDetail)
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g,''));
  console.log(dollars);
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

  let count = 0;
movieDetail.Awards.split(' ').forEach((word) => {
    let value  = parseInt(word);//if we do parseInt over a string we get NaN from javascript
    //isNaN()->function built in javascript that checks whether value is NaN or not
    if(isNaN(value)){
      return;
    }
    else{
      count = count + value;
    }
   
});
const awards = count;


//we can use reduce to carry out the same thing


    return `<article class="media">
    <figure class="media-left">
      <p class="image"><img src="${movieDetail.Poster}" alt=""></p>
    </figure>

    <div class="media-content">
      <div class="content">
        <h1 style = "color:white">${movieDetail.Title}</h1>
        <h4 style = "color:white">${movieDetail.Genre}</h4>
        <p style = "color:white">${movieDetail.Plot}</p>
        <p><b>Actors: ${movieDetail.Actors}</b></p>
      </div>
    </div>

  </article>


  <article  data-value = ${awards}   class="notification movie-info">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value = ${dollars} class="notification movie-info">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">BoxOffice</p>
    </article>
    <article data-value = ${metascore}  class="notification movie-info">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">MetaScore</p>
    </article>
    <article  data-value = ${imdbRating} class="notification movie-info">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">imdbRating</p>
    </article>
    <article  data-value = ${imdbVotes} class="notification movie-info">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">imdbAwards</p>
    </article>
    
  `
}

//to make another autocomplete we have to duplicate the code written and then arbitraliry change the variable name which is really bad way to approach the problem\\
//so we are going to divide the code into file and use autocomplete.js to make the code more reusable

//^ inside index.js
//^ non-resuable code for our very sp^ecific Project  
//^ fetchData() -> fucntion to find movies
//^ renderOption()->function that know ho^w to render a movie
//^ onOptionSelect()-> fucntion that gh^ets invoked when a user clicks an op^tion
//^ root-> element that the au^tocompelte should be rendered into 

//new file->autocomplete.js
//^super reusable code to get an autocomplete to wokr. Zero knowledge of 'movie' or 'reciped' or 'blogs'. Must be able to ran several time in the same project
//^->fucntion that will take the autocomplete config and render an autocomplete on the screen
