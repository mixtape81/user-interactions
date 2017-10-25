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
|genre_id      |integer, id of genre that playlist belongs to |
|logId         |integer, id log for this event                |


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
|genre_id      |integer, id of genre that song belongs to     |
|logId         |integer, id log for this event                |
|liked         |boolean/NULL, (true/false) (likes/dislikes)   |


**Song Responses**

|field name    |field type                                    |
|--------------|----------------------------------------------|
|id            |integer, auto increasing                      |
|song_id       |integer, id of song                           |
|playlist_id   |integer, id of playlist of song               |
|listenedTo    |boolean, true/false (song heard/skipped)      |
|logId         |integer, id log for this event                |



**Search**

|field name    |field type                                    |
|--------------|----------------------------------------------|
|id            |integer, auto increasing                      |
|value         |string, defines term that was searched        |
|user_id       |integer, id of user who searched              |
|logId         |integer, id log for this event                |



**Logs**

|field name    |field type                                    |
|--------------|----------------------------------------------|
|id            |integer, auto increasing                      |
|event_id      |integer, foreign key - events table           |
|session_id    |integer, foreign key - sessions table         |
|user_id       |integer, id of user who triggered event       |


### /playlistviews

**will respond with all playlist views for that day**

GET request to '/playlistviews' will return an array of objects that will include the playlist_id, genre_id and timestamps of all the playlist that were viewed that day.

Example:

```

request.get('/playlistviews');

//response

[
  {
    playlist_id: 1,
    createdAt: "2017-10-04T22:46:20.345Z",
    updatedAt: "2017-10-04T22:46:20.345Z",
    genre_id: 2
    },
  {
    playlist_id: 2,
    createdAt: "2017-10-04T22:46:20.361Z",
    updatedAt: "2017-10-04T22:46:20.361Z",
    genre_id: 3
  }
]