# API Documentation

## Schema

Will add schema here





### /playlistviews

** will respond with all playlist views for that day **

GET request to '/playlistviews' will return an array of objects that will include the id's of all the playlist that were viewed that day.

Example:

```

request.get('/playlistviews');

//response

[
  {
    playlist_id: 1
    },
  {
    playlist_id: 2
  }
]