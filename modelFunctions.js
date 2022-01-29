module.exports = {
  //data coming from the searched value
  // function to get data from the search results with the type search being either album search or artist search of track search

  getAlbums( type, imgLink ) {
    return type.data.albums.map( ( ele, i ) => {
      return {
        albumName: ele.name,
        releasedDate: ele.released,
        id: ele.id,
        tracks: ele.trackCount,
        artist: ele.artistName,
        explicit: ele.isExplicit,
        // using the the index to get the imgLink from the array
        img: imgLink[ i ]
      }
    } )
  },

  getSearchData( type ) {
    return type.map( ele => {
      return {
        name: ele.name,
        type: ele.type ? ele.type : "",
        id: ele.id ? ele.id : "",
        release: ele.released ? ele.released : "",
        genre: ele.links.genres ? ele.links.genres : "",
        images: ele.links.images ? ele.links.images : "",
        tracks: ele.links.tracks ? ele.links.tracks : ele.links.topTracks,
        blurb: ele.blurbs ? ele.blurbs : ""
      }
    } )
  },

  //details of the searchResults
  getSearchDetails( type ) {
    const dataType = type.albums ? type.albums : type.artists
    return dataType.flat()
      .map( ele => {
        return {
          type: ele.type,
          id: ele.id,
          name: ele.name,
          explicit: ele.explicit ? ele.explicit : null,
          released: ele.released ? ele.released : null,
          images: ele.links.images ? ele.links.images : null,
          genres: ele.links.genres ? ele.links.genres : null,
          tracks: ele.links.tracks ? ele.links.tracks : ele.links.topTracks
        }
      } )
  },
  //function get get the tracks from either the aritsit or the albums
  getTracks( tracks ) {
    return tracks.map( ele => {
      return {
        type: ele.type,
        id: ele.id,
        explict: ele.isExplicit,
        trackName: ele.name,
        albumName: ele.albumName ? ele.albumName : null,
        aritstName: ele.artistName,
        url: ele.previewURL
      }
    } )
  }
}
