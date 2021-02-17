 var clientId = '09bf23cae43e4d4fa72a68cdbd64e77a';
var  clientSecret = '3e0142ab12d64c4c9eec6f2787446382';

var nexturl="";
var preurl="";
var playlistid=[];
var getplaylistid=[];
var tracks=[];
var track_uri;
var user_track=1;
var search_track=2;
var track_url;
var current_user_url;
var current_user;
var Tdisplay=Tdisplay=document.getElementById('tracks');;
var row=document.getElementById('d');


// getting accesstoken
    var token_url=window.location.href;
    token_url=token_url.split("#");
    if(token_url[1]==undefined)
    {
        window.location.replace('spotify.html')
    }

    var search_token_url="?"+token_url[1];
    console.log(search_token_url);
    const urlParams = new URLSearchParams(search_token_url);
    const myParam = urlParams.get('access_token');
    if(myParam==null)
    {
        window.location.replace('spotify.html')
    }
    var token=myParam;
    console.log(myParam)

// getting userid
    async function getallplaylist(){

        try{
            var  result = await fetch('https://api.spotify.com/v1/me', {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });
            var  data = await result.json();
        return data;
        }
        catch(err)
        {
            console.log(err);
        }
    }

//searching for playlist
        async function search(givenurl){
        
            try{
                var  result = await fetch(givenurl, {
                    method: 'GET',
                    headers: { 'Authorization' : 'Bearer ' + token}
                });
                var  data = await result.json();
                return data;
            }
            catch(err)
            {
                console.log(err);
            }
        }
// getting playlist values        
    async function  getUserPlaylist  (url, token) {
        
        try{
            var  result = await fetch(url, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
                
            });
            var  data = await result.json();
            return data;
        }
        catch(err)
        {
            console.log(err);
        }
    
    }

// getting tracklist of playlist
    async function  getTracks (id,num) {
        
        var j=id.slice(1);
        console.log(num)
        var name=document.getElementById(id).innerText;
        var track_url=tracks[j];
        try{
            var  result = await fetch(track_url, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
                
            });
            var  data = await result.json();
            displaytracks(data,name,num,track_url)
        }
        catch(err)
        {
            console.log(err);
        }
    
    }

// removing a track from a users playlist
    async function Removetrack(id,trackurl,turi)
        {
        console.log(id,trackurl,turi)

        try{
            var  result = await fetch(trackurl, {
                method: 'DELETE',
                headers: {"Content-Type" :"json",
                    'Authorization' : 'Bearer ' + token},
                body:JSON.stringify({
                    "tracks": [
                    {
                        "uri": turi,
                    },
                    ]
                })
                
            });
            var  data = await result.json();
            document.getElementById(id).parentElement.remove()
        }
        catch(err)
        {
            console.log(err);
        }
    }

    // adding a track to user playlist
    async function AddTrack(id,trackurl,turi)
    {
        https://api.spotify.com/v1/playlists/{playlist_id}/tracks
        https://api.spotify.com/v1/users/{user_id}/playlists

        try{
            var  result = await fetch('https://api.spotify.com/v1/users/'+current_user+'/playlists', {
                method: 'POST',
                headers: {"Content-Type" :"json",
                    'Authorization' : 'Bearer ' + token},
                body:JSON.stringify({
                    "name": "New Playlist",
                    "description": "New playlist description",
                    "public": false
                  })
            });
            var  data = await result.json();
           console.log(json)
        }
        catch(err)
        {
            console.log(err);
        }
    }

//follow and unfollow a playlist 
        async function followPlaylist(id)
        {
            var val=document.getElementById(id).innerText;
            var list;
            console.log(id,playlistid,val);
            if(val=="follow")
            {
                list=playlistid[id];
                
                var f_url='https://api.spotify.com/v1/playlists/'+list+'/followers'
                try{
                    var  result = await fetch(f_url, {
                        method: 'PUT',
                        headers: { 'Authorization' : 'Bearer ' + token},
                        body:"public=false"
                    });
                    var  data = await result.json();
                //console.log(data)
                    return data;
                }
                catch(err)
                {
                    //console.log(err);
                }
                
            }
            else{
                list=getplaylistid[id];
                console.log(getplaylistid)
                var f_url='https://api.spotify.com/v1/playlists/'+list+'/followers'
                try{
                    var  result = await fetch(f_url, {
                        method: 'DELETE',
                        headers: { 'Authorization' : 'Bearer ' + token}
                        
                    });
                    var  data = await result.json();
                console.log(data)
                    return data;
                }
                catch(err)
                {
                    //console.log(err);
                }
                (document.getElementById(id).parentElement.remove())
            
            }

        }



document.getElementById('playlist').addEventListener('click',()=>{

    document.getElementById('snext').style.display="none"
    document.getElementById('sprev').style.display="none"
    Tdisplay.style.display="none"
    
    getallplaylist().then((result)=>{
        console.log(result.id)
        current_user=result.id;
        current_user_url='https://api.spotify.com/v1/users/'+result.id+'/playlists?offset=0&limit=5';
        getPlaylistWithImage(current_user_url);
    })

});
 
document.getElementById("next").addEventListener('click',async()=>{
   
    getPlaylistWithImage(nexturl);
});


document.getElementById("prev").addEventListener('click',async()=>{
    getPlaylistWithImage(preurl);
       
});

document.getElementById("snext").addEventListener('click',async()=>{
    searchPlaylistWithImage(nexturl);
});


document.getElementById("sprev").addEventListener('click',async()=>{
    searchPlaylistWithImage(preurl);
});
       


document.getElementById("search").addEventListener('click',async()=>{
    Tdisplay.style.display="none"
    document.getElementById('next').style.display="none"
    document.getElementById('prev').style.display="none"
    var query=document.getElementById('query').value
   var search_url='https://api.spotify.com/v1/search?q='+query+'&type=playlist'
    searchPlaylistWithImage(search_url);
});


async function searchPlaylistWithImage(givenurl)
 {
    tracks=[];
        row.innerHTML="";
     var data=await search(givenurl,token);
     console.log(data);
     if(data==null)
     {
        console.log("no playlist to display")
     }
     else
     {
         for(i=0;i<data.playlists.items.length;i++)
        {
            var col_img=document.createElement('div');
            col_img.setAttribute('class','col-sm-12  col-md-6 col-lg-2 border border-warning rounded m-3');
            var img=document.createElement('img');
            if(data.playlists.items[i].images[0].img!=" ")
            {
                
            img.setAttribute('src',data.playlists.items[i].images[0].url)
            }
            img.setAttribute('height',300);
            img.setAttribute('width',300);
            img.setAttribute('class','img-thumbnail');
    

            tracks.push(data.playlists.items[i].tracks.href);
          
            
            var p=document.createElement('a')
            p.setAttribute('id',"p"+i)
            p.setAttribute('href','#');
            p.setAttribute('onclick','getTracks(this.id,search_track)');
            p.innerText=data.playlists.items[i].name;
            
            playlistid.push(data.playlists.items[i].id);
            var follow=document.createElement('button');
            follow.setAttribute('class','btn btn-outline-primary m-2');
            follow.setAttribute('id',i)
            follow.setAttribute('onClick','followPlaylist(this.id)')
            follow.innerText="follow";
           
           
            col_img.append(img,p,follow)
            row.append(col_img)

        
            if(data.playlists.next!=null)
            {
                nexturl=data.playlists.next;
                document.getElementById('snext').style.display="block";
            }
            else
            {
                document.getElementById('snext').style.display="none";
            } 
            if(data.playlists.previous!=null)
            {
                preurl=data.playlists.previous;
                console.log(data);
                document.getElementById('sprev').style.display="block";
            }
            else
            {
                document.getElementById('sprev').style.display="none";
            } 
        }
    }

}




async function getPlaylistWithImage(givenurl)
 {
    tracks=[];
        row.innerHTML="";
     var data=await getUserPlaylist(givenurl,token);
     console.log(data)
     if(data==null)
     {
        console.log("no playlist to display")
     }
     else
     {
         for(i=0;i<data.items.length;i++)
        {
            var col_img=document.createElement('div');
            col_img.setAttribute('class','col-sm-12  col-md-6 col-lg-2 border border-warning rounded m-3');
            var img=document.createElement('img');
            if(data.items[i].images[0].img!=" ")
            {
                
            img.setAttribute('src',data.items[i].images[0].url)
            }
            img.setAttribute('height',300);
            img.setAttribute('width',300);
            img.setAttribute('class','img-thumbnail');
    

            tracks.push(data.items[i].tracks.href);
            var p=document.createElement('a')
            p.setAttribute('id',"p"+i)
            p.setAttribute('href','#');
            p.setAttribute('onclick','getTracks(this.id,user_track)');
            p.innerText=data.items[i].name;
            
            getplaylistid.push(data.items[i].id);
            var follow=document.createElement('button');
            follow.setAttribute('class','btn btn-outline-primary m-2');
            follow.setAttribute('id',i)
            follow.setAttribute('onClick','followPlaylist(this.id)')
            follow.innerText="unfollow";
            col_img.append(img,p,follow)
            row.append(col_img)
        
            if(data.next!=null)
            {
                nexturl=data.next;
                document.getElementById('next').style.display="block";
            }
            else
            {
                document.getElementById('next').style.display="none";
            } 
            if(data.previous!=null)
            {
                preurl=data.previous;
                console.log(data);
                document.getElementById('prev').style.display="block";
            }
            else
            {
                document.getElementById('prev').style.display="none";
            } 
        }
    }

}

function displaytracks(data,name,num,trackurl)
{
    console.log(data)
    console.log(trackurl)
    track_url=trackurl
    var caption=document.getElementById('tracktable')
    caption.innerText=name;
     Tdisplay=document.getElementById('tracks');
    var table_body=document.getElementById('trackbody')
    table_body.innerHTML=""
    for(i=0;i<data.items.length;i++)
    {
        var tr=document.createElement('tr')
        var trackname=document.createElement('td');
        trackname.innerText=data.items[i].track.name;
        var artistname=document.createElement('td')
        artistname.innerText=data.items[i].track.album.artists[0].name;
        tr.append(trackname,artistname);
        if(num==1 & current_user==data.items[i].added_by.id)
        {
            track_uri=data.items[i].track.uri;
            var td=document.createElement('td');
            var remove=document.createElement('button');
            remove.setAttribute('class','btn btn-outline-primary m-2');
            remove.setAttribute('id',data.items[i].track.id)
            remove.setAttribute('onclick','Removetrack(this.id,track_url,track_uri)')
            remove.innerText="REMOVE"
            td.append(remove);
            tr.append(td)
        }
        if(num==2)
        {
            var td1=document.createElement('td');
            var add=document.createElement('button');
            add.setAttribute('class','btn btn-outline-primary m-2');
            add.setAttribute('id',"p"+data.items[i].track.id)
            add.setAttribute('onclick','AddTrack(this.id,track_url,track_uri)')
            add.innerText="ADD"
            td1.append(add)
            tr.append(td1)
        }        
        table_body.append(tr)
    }
    Tdisplay.style.display="block"
}

