const API_KEY = 'api_key=f2ac18aabcb0e831d72750cefc9ec61c';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/movie/popular?'+API_KEY+'&language=en-US&page=1';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY; 
const searchmovie = BASE_URL +'/movie/';


const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const mybtn = document.getElementById('mybtn');
 

function getdata(url)
{

    fetch(url).then((response)=>{
        return response.json();
    }).then((data)=>{
        const movieid=data.results[0].id;
        showmoviebanner(searchmovie+movieid+'?'+API_KEY+'&language=en-US')
        movie_recs(movieid,data.results[0].title);
    })
    

}


function showmoviebanner(url) {
    fetch(url).then((response)=>{
        return response.json();
    }).then((data)=>{
        const movielement =document.createElement('div');
        movielement.classList.add('banner-container');
        movielement.innerHTML= ` 
            <img src="${IMG_URL+data.poster_path}" alt="${data.title}" height="375" width="250">
            <h1 class="white pb-3" style=font-size:70px> ${data.title}</h1>
            <div class="startanalysis">                
                    <button id="mybtn" class="btn btn-dark btn" >${data.overview}</button>
            </div>
            <main id="main">
            
            <div id="loading">
            </div>
            <div id="loading">
            </div>
            <div id="loading">
            </div> 
        </main>
            <div class="startanalysis">                
                    <button id="mybtn" class="btn btn-danger btn" >Similar to your searched movie</button>
            </div>
        
        `
        main.appendChild(movielement);
    })    
       
}



function getspecificmovie(url)
{

    fetch(url).then((response)=>{
        return response.json();
    }).then((data)=>{
        const movielement =document.createElement('div');
        movielement.classList.add('movie');
        movielement.innerHTML= `
            <img src="${IMG_URL+data.poster_path}" alt="${data.title}">
            
            <div class="movie-info">
                <h3>${data.title}</h3>
                <span class="${getcolor(data.vote_average)}">${data.vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${data.overview}
            </div>
        
        `
        main.appendChild(movielement);
    })
}






function getcolor(vote) {
    if(vote>= 6){
        return 'green'
    }
    
    else if(vote >= 5){
        return "orange"
    }
    else{
        return 'red'
    }
}

//passing movie name to get recommended movies
function movie_recs(movie_id, movie_title){
    $.ajax({
      type:'Post',
      url:"/recommend",
      data:{'name':movie_title, 'title':movie_title},
      success: function(recs){
        console.log(recs)
        var arr = [];
        var movie_arr = recs.split('---');
        for(const movie in movie_arr){
        arr.push(movie_arr[movie]);
          }
          console.log(arr)
          getmoviesarray(arr);
        
      },
      error: function(){
        alert("error recs");
      },
    }); 
  }


  
function getmoviesarray(arr)
{

    for (let i = 0; i < arr.length; i++){
        console.log(arr[i])
        getrcmddata(searchURL+'&query='+arr[i]);
    }
    

}


function getrcmddata(url)
{

    fetch(url).then((response)=>{
        return response.json();
    }).then((data)=>{
        if(data === undefined) {return}
        console.log(data.results)
        const movieid=data.results[0].id;
        getspecificmovie(searchmovie+movieid+'?'+API_KEY+'&language=en-US')
    })
    

}
function scrollWindow(){
    window.scrollBy(0,100);

}



form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchterm = search.value;
    if(searchterm) {
        getdata(searchURL+'&query='+searchterm);
               
    }
    scrollWindow()
})

