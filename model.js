const axios = require( "axios" )
const modelState = require( "./modelState.js" )
const helpers = require( "./helper.js" )
const modelFunc = require( "./modelFunctions.js" )

function setTimer( timer ) {
  return new Promise( ( _, reject ) => {
    setTimeout( function () {
      reject( new Error( "timer passed" ) )
    }, timer * 1000 )
  } )
}


async function getImg( model ) {
  // function to fetch data of  all images from the albmum array
  try {
    const imgResponse = model.map( async ele => await axios.get( `${ele}?apikey=${helpers.API_KEY}` ) )
    // using "promise.all" to get all the images once
    const imgData = await Promise.all( imgResponse )
    return imgData.map( ( el, i ) => el.data )
      .map( el => el.images )
  } catch ( err ) {
    throw err;
  }
}


async function albumsImg( imgArr ) {
  const imgLink = await getImg( imgArr )
  return imgLink
}

function getImageLink( data ) {
  return data.data.albums.map( el => el.links.images.href )
}

module.exports = {
  //function to get the musiceAlbum data
  async getMusicData() {
    try {
      const response1 = axios.get( `${helpers.API_URL}=${helpers.API_KEY}` )
      const response2 = axios.get( `${helpers.API_URL}=${helpers.API_KEY}&range=day` )
      const [ musicResponse1, musicResponse2 ] = await Promise.all( [ response1, response2 ] )
      const data = await Promise.race( [ setTimer( 10 ), musicResponse1 ] )
      // get all the href image attribute fro the data received

      // calling getImg here to get the real image with the href attribute received

      modelState.albumsDetails = modelFunc.getAlbums( data, await albumsImg( getImageLink( data ) ) )

      const data2 = await musicResponse2
      modelState.albumTopDetails = modelFunc.getAlbums( data2, await albumsImg( getImageLink( data2 ) ) )
    } catch ( err ) {
      throw err
    }
  },




  async searchMusic( query ) {
    // functio to get search data
    try {
      const responseResult = await axios.get( `https://api.napster.com/v2.2/search/verbose?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&query=${query}` )
      const dataResults = await ( responseResult )
      const { data } = dataResults.data.search;
      const albums = data.albums;
      const artist = data.artists;
      const tracks = data.tracks;
      // data to get the album search results
      modelState.searchResults[ 0 ].albums = [ albums ].map( el => modelFunc.getSearchData( el ) )
      //data to get the artist search results
      modelState.searchResults[ 0 ].artists = [ artist ].map( el => modelFunc.getSearchData( el ) )
    } catch ( err ) {
      throw err
    }

  },

  // function to get the details of the search results
  async searchInfo( type, id, top, limit ) {
    //putting type and id as parameters to make the function dynamic "so that the function can work whether it's the artist you requested a detail from or the album"
    try {
      // type here could either be the album or the artist
      const responseSearchDetail = await axios.get( `http://api.napster.com/v2.2/${type}/${id}?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4` )
      const dataDetail = await responseSearchDetail
      // calling getSearchDetails here and returning a new object of data from either the artist or the album
      modelState.musicInfo = modelFunc.getSearchDetails( dataDetail.data )
      // passing limit and top to make the url below work for tracks either from the artist or the album
      const responseTrack = await axios.get( `http://api.napster.com/v2.2/${type}/${modelState.musicInfo[0].id}/tracks${top ? `/top` : ""}?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4${limit ? `&limit=10` : ""}` )
      const trackDetail = await responseTrack
      modelState.musicInfoDet = modelFunc.getTracks( trackDetail.data.tracks )
    } catch ( err ) {
      throw err;
    }
  }
}
