# API Documentation

## Schema

**Events**

|field name    |field type                                    |
|--------------|----------------------------------------------|
|id            |integer, auto increasing                      |
|type          |string, defines type of event                 |


**Playlist View**

|field name    |field type                                    |
|--------------|----------------------------------------------|
|id            |integer, auto increasing                      |
|playlist_id   |integer, id of playlist viewed                |
|user_id       |integer, id of user who viewed playlist       |
|genre_id      |integer, id of genre that playlist belongs to |

**Sessions**

|field name    |field type                                    |
|--------------|----------------------------------------------|
|id            |integer, auto increasing                      |
|user_id       |integer, id of user belonging to session      |
|hash          |string, unique hash to define session for user|

**Song Reactions**

|field name    |field type                                    |
|--------------|----------------------------------------------|
|id            |integer, auto increasing                      |
|song_id       |integer, id of song                           |
|playlist_id   |integer, id of playlist of song               |
|user_id       |integer, id of user who reacted to song       |
|genre_id      |integer, id of genre that song belongs to     |
|liked         |boolean/NULL, (true/false) (likes/dislikes)   |

**Song Responses**

|field name    |field type                                    |
|--------------|----------------------------------------------|
|id            |integer, auto increasing                      |
|song_id       |integer, id of song                           |
|playlist_id   |integer, id of playlist of song               |
|user_id       |integer, id of user who responsded            |
|listenedTo    |boolean, true/false (song heard/skipped)      |

**Search**

|field name    |field type                                    |
|--------------|----------------------------------------------|
|id            |integer, auto increasing                      |
|value         |string, defines term that was searched        |
|user_id       |integer, id of user who searched              |

**Logs**

|field name    |field type                                    |
|--------------|----------------------------------------------|
|id            |integer, auto increasing                      |
|event_id      |integer, foreign key - events table           |
|session_id    |integer, foreign key - sessions table         |
|interaction_id|integer, foreign key - specific event table   | 
|user_id       |integer, id of user who triggered event       |


### /playlistviews

** will respond with all playlist views for that day **

GET request to '/playlistviews' will return an array of objects that will include the id's of all the playlist that were viewed that day.

Example:

```

request.get('/playlistviews');

//response

[
  {
    playlist_id: 1,
    created_at: "2017-10-04T22:46:20.345Z",
    updated_at: "2017-10-04T22:46:20.345Z",
    genre_id: 2
    },
  {
    playlist_id: 2,
    created_at: "2017-10-04T22:46:20.361Z",
    updated_at: "2017-10-04T22:46:20.361Z",
    genre_id: 3
  }
]