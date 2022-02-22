"use strict"
const heroImgContainer = document.querySelectorAll( ".hero-img" );
const imgArtist = document.querySelectorAll( ".img-artist" );
const tracks = document.querySelector( ".tracks" );
const icon = document.querySelectorAll( ".icon" );
const listItem = document.querySelector( ".list-item-track" );
let id = [];
let result = [];
let targetAudio;
$( ".hero-container" )
  .slick( {
    autoplay: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    pauseOnHover: false,
    pauseOnFocus: false,
    arrows: false,
  } );




if ( document.querySelector( ".result-artist" ) ) {
  if ( document.querySelector( ".result-artist" )
    .children.length === 0 ) {
    document.querySelector( ".result-artist" )
      .remove()
    document.querySelector( ".artist-heading" )
      .remove()
  }
}


// a function to that basically check if there's an error on the image and rejects immediately
function getArtistImg( img ) {
  return new Promise( ( _, reject ) => {
    img.addEventListener( "error", () => {
      reject( "err" )
    } )
  } )
}



//looping all the images from the artist array and catching all errors if ther's is an errror with loading the img
imgArtist.forEach( async function ( ele ) {
  try {
    await getArtistImg( ele )
  } catch ( err ) {
    ele.closest( ".img-artist-container" )
      .querySelectorAll( ".no-img" )
      .forEach( ele => {
        ele.innerHTML = "no image"
        ele.classList.remove( "display-img" )
      } )
  }
} )


//icon play icon pause


function resetTrack( e ) {
  document.querySelectorAll( ".icon" )
    .forEach( ( ele, i ) => {
      if ( e.target !== ele ) {
        icon[ i ].setAttribute( "src", "/img/play-button-arrowhead.png" )
        icon[ i ].classList.remove( "pause-outline" )
        icon[ i ].closest( "li" )
          .firstElementChild.pause()
      };
    } );
};


//once this function is called it sets the attribute on any element
function checkClass( e, cla, type, attr ) {
  targetAudio = e.target.closest( "li" )
    .firstElementChild;
  e.target.setAttribute( type, attr )

  if ( cla === "pause-outline" ) targetAudio.play();
  if ( cla === "play-outline" ) targetAudio.pause();
};


function storeItems( id ) {
  result = Object.values(
    id.reduce( ( accumulator, item ) => {
      const { id, ...rest } = item;
      return {
        ...accumulator,
      [ id ]: { id, ...rest }
      };
    }, {} )
  );
  return result;
}



tracks.addEventListener( "click", function ( e ) {
  //logic for changing state of the play and pause
  if ( e.target.classList.contains( "icon" ) ) {
    e.target.classList.toggle( "pause-outline" )
    resetTrack( e );
    e.target.classList.contains( "pause-outline" ) ?
      checkClass( e, "pause-outline", "src", "/img/pause.png" ) :
      checkClass( e, "play-outline", "src", "/img/play-button-arrowhead.png" )
    targetAudio.addEventListener( "ended", () => e.target.setAttribute( "src", "/img/play-button-arrowhead.png" ) );
  }


  // logic for changing state of the heart icon
  if ( !e.target.classList.contains( "heart-icon" ) ) return;
  e.target.classList.toggle( "outline" );
  e.target.classList.contains( "outline" ) ?
    checkClass( e, null, "name", "heart-outline" ) :
    checkClass( e, null, "name", "heart" )
  id.push( {
    id: e.target.getAttribute( "id" ),
    name: e.target.getAttribute( "name" )
  } )


  localStorage.setItem( "liked", JSON.stringify( storeItems( id ) ) )
} );



  // function to get the objects from localStorage as soon as the screen loads
function getLiked() {
  let data = JSON.parse( localStorage.getItem( "liked" ) )
  if ( !data ) return;
  id = data;
  document.querySelectorAll( ".heart-icon" )
    .forEach( ( ele, i ) => {
      // checking if the id from the icons === the id of the icons and return the corressponding id
      id.filter( ( el, i ) => {
        if ( el.id === ele.getAttribute( "id" ) )
          ele.setAttribute( "name", el.name )
      } )

      if ( ele.getAttribute( "name" ) === "heart" ) ele.classList.remove( "outline" )
      if ( ele.getAttribute( "name" ) === "heart-outline" ) ele.classList.add( "outline" )
    } )
}

getLiked()
