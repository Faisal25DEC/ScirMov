const createAutoComplete = ({ renderOption,inputValue,fetchData,root, onOptionSelect,onMovieSelect}) => {

root.innerHTML = `
    <label style = "color:white"><b>Search for a Movie</b></label>
    <input class = "input"/>
    <div class = "dropdown">
        <div class = "dropdown-menu">
            <div class = "dropdown-content results"></div>
        </div>
    </div>
`;
const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results')

// ~input.addEventListener('input', (event) =>{
    //^this line will take the input and fetch the data from the api based of the input value but thats kind off too much coz we would make request for every single letter that we will type in the input and that would eat up a lot of our api requests(since we only have like 1000 requests/day), so what we do here is we will make sure that the data is fetched when user has stopped typing for a little bit of time (like 0.5 seconds or so )
    //~ fetchData(event.target.value)


//~let timeoutId;
//~const onInput = event => {
//~    //debouncing an input, great process when we want to wait for a function to run only after centain event conclude
//~    if(timeoutId){
//~        clearTimeout(timeoutId);//->TIMEOUTiD UNDECLARED
//~        console.log('timeout was cleared')
//~    }
//~    timeoutId = setTimeout(()=>{
//~        console.log('hi')
//~        fetchData(eventimeoutIdt.target.value)
//~    },1000);
//~}
//onInput holds a reference to function returned by debounce
const onInput =  debounce(async (event)=>{
    
    //^this function below is returning us the movies array from api
   const items =  await fetchData(event.target.value);
   if(!items.length){
       dropdown.classList.remove('is-active');
   }
   else{
   dropdown.classList.add('is-active')}
   //clearing the resultsWrapper whenver something new is typed
   resultsWrapper.innerHTML = '';
    for( let item of items){
        //^we will iterate through movies and create a div for each movie which will contain the title and poster of that movie, though we are getting error on an invalid input but we resolved it using if(response.data.Error)->return [](empty array);

        const option = document.createElement('a');
     
        //adding the dropdown contents 
        option.classList.add('dropdown-item')
        //using innerHTML
        option.innerHTML = renderOption(item); 
        //click on movie->removing the dropdown and replacing input value with movie title
        option.addEventListener('click', ()=>{
            input.value = inputValue(item);
            dropdown.classList.remove('is-active');
             onOptionSelect(item);
            // do another request
            //get data
            //render data
        
           
        })
        resultsWrapper.appendChild(option);
    }
})
//^one of the good practice to write websites is to limit coupling between html and javascript.If we depend less on our markup for structuring and do structuring flexibly with javascirpt, it would be much more intuitive and nicer.So lets do it
input.addEventListener('input',onInput);
document.addEventListener('click', event => {
    
    if(!root.contains(event.target)){
        //if not clicked within root -> close the dropdown
        dropdown.classList.remove('is-active')
    }
});
};