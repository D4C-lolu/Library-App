//Song class
class Songs{
    constructor(title,album,artiste,year,rating,starPercent){
        this.title=title;
        this.album=album;
        this.artiste=artiste;
        this.year=year;
        this.rating=rating;
        this.starPercent=starPercent;
    }
}

//UI class: Handles UI tasks
class UI{
    static displaySongs(){
        
        const songs=Store.getSongs();
        songs.forEach(song=>UI.addSongsToList(song));

    }
    
    static addSongsToList(song){
        const list=document.getElementById('results');
        const row=document.createElement('tr');
        row.innerHTML=`
                        <td>${song.title}</td>
                        <td>${song.album}</td>
                        <td>${song.artiste}</td>
                        <td>${song.year}</td>
                        <td>
                            <div class="stars-outer">
                                <div class="stars-inner"></div>
                            </div>
                        </td>
                        <td><button class="deleteButton">X</button></td>
                        `;
        list.appendChild(row);
        row.setAttribute("id",`${song.title}`);
        let newRow=document.getElementById(`${song.title}`);
        newRow.lastElementChild.previousElementSibling.firstElementChild.firstElementChild.style.width=song.starPercent;                         
    } 
     
    
    static deleteSong(song){
        if(song.classList.contains('deleteButton')){
            song.parentElement.parentElement.remove();
        }

    }
    static showAlert(message,className){
        const div=document.createElement('div');
        div.className=`alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container=document.querySelector('body');
        const section=document.querySelector('#section-1');
        container.insertBefore(div,section);
        //vanish in 3 secs
        setTimeout(()=>document.querySelector('.alert').remove(),3000);



    }
  
    static clearFields(){
        document.getElementById('songname').value='';
        document.getElementById('albumname').value='';
        document.getElementById('artiste').value='';
        document.getElementById('year').value='';
        document.getElementById('star-rating').value='';

    }
    
}

//Storage class:Handles storage
class Store{
    static getSongs(){
        let songs;
        if (localStorage.getItem('songs')===null){
            songs=[];
        }
        else{
            songs=JSON.parse(localStorage.getItem('songs'));
        }

        return songs
    }


    static addSongs(song){
        const songs=Store.getSongs();
        songs.push(song);
        localStorage.setItem('songs',JSON.stringify(songs));
    }


    static removeSongs(title,album){
        const songs=Store.getSongs();
        songs.forEach((song,index)=>{
            if ((song.title===title)&&(song.album===album)){
                songs.splice(index,1);
            }

        });

        localStorage.setItem('songs',JSON.stringify(songs));
    }
    
  
}

//Event:Display songs
document.addEventListener('DOMcontentLoaded',UI.displaySongs());

//Event:Add a song
document.querySelector('#myform').addEventListener('submit',(e)=>{

    e.preventDefault();
    var title=document.getElementById('songname').value;
    var album=document.getElementById('albumname').value;
    var artiste=document.getElementById('artiste').value;
    var year=document.getElementById('year').value;
    var rating=document.getElementById('star-rating').value;
    const starPercentage=(rating/10)*100;
    const starPercentageRounded=`${(Math.round(starPercentage/10)*10)}%`;
    var starPercent=starPercentageRounded;

    
    //Validate book
    if (title===''||album===''||artiste===''||year===''||rating===''){
        
        UI.showAlert('Please fill all fields','red');
    }
    else{
        //create song
        const song=new Songs(title,album,artiste,year,rating,starPercent);
        //Add to UI
        UI.addSongsToList(song);
        //Add to store
        Store.addSongs(song);
        //show success message
        UI.showAlert('Song added','green')
        //Clear Fields
        UI.clearFields();
    }
});

//Event:Remove a song
document.querySelector('#results').addEventListener('click',(e)=>{
    UI.deleteSong(e.target);
    //Remove from local storage
    Store.removeSongs(e.target.parentElement.parentElement.firstElementChild.textContent,e.target.parentElement.parentElement.firstElementChild.nextElementSibling.textContent);
    //show success
    UI.showAlert('Book removed','green');

})

