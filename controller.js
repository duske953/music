require("dotenv").config();
const fetchMusicData = require("./model.js");
const modelState = require("./modelState.js");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", async function (_, res) {
  try {
    // geteting the data from the "model"
    await fetchMusicData.getMusicData();
    res.render("musicHome", {
      album: modelState.albumsDetails,
      topAlbums: modelState.albumTopDetails,
    });
  } catch (err) {
    console.log(err.message);
    // res.redirect("back");
  }
});

app.get("/search", async function (req, res) {
  try {
    await fetchMusicData.searchMusic(req.query.q);
    res.render("searchPage", {
      resultsAlbum: modelState.searchResults[0].albums,
      query: req.query.q,
      resultArtist: modelState.searchResults[0].artists,
    });
  } catch (err) {
    res.redirect("back");
  }
});

app.get(["/Album/:Id", "/Artist/:Id"], async function (req, res) {
  try {
    const route = req.params.Id.split("-");
    if (route[1] === "albums")
      await fetchMusicData.searchInfo(...route.reverse());
    if (route[1] === "artists")
      await fetchMusicData.searchInfo(...route.reverse(), true, true);
    res.render("musicInfo", {
      musicInfo: modelState.musicInfo,
      musicInfoDet: modelState.musicInfoDet,
    });
  } catch (err) {
    res.redirect("back");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server started");
});
