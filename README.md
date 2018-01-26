# User Interactions Service

This is the User Interactions Service for Mixtape (Spotify Clone). It consumes any interactions that the user has with the UI (e.g. playlists clicked, songs heard, songs skipped, genres searched). The service stores this data (as one source of truth), aggregates them and publishes them to Analysis trhough AWS SQS to find patterns in listening habits of users. 

The information stored by this service can also be queried to monitor number of active sessions in a day, the duration of these sessions, the number of sessions per user, what kind of events are most popular.

# Table of Contents

1. [Usage](#Usage)
2. [Requirements](#requirements)
3. [System Overview](#system-overview)
4. [System Service Architecture](#system-service-architecture)
<!-- 5. [Messages Consumed](#messages-consumed)
    1. [Search Query (from Search Service)](#search-query)
    1. [Search Results (from Search Service)](#search-results)
    1. [Booking Details (from Inventory Service)](#booking-details)
1. [Messages Published](#messages-published)
    1. [Sort Order Scores](#sort-order-scores)
    1. [Format](#format)
1. [Schema Design](#schema-design)
    1. [Inventory Service Schema](#inventory-service-schema)
    1. [Recommendation Service Schema](#recommendation-service-schema) -->

## Usage

To install, run the following commands. Make sure to update the proper locations for Elastic Search, Postgres, Redis, and SQS Services.

```
npm install
```

## Requirements

- aws-sdk 2.141.0
- bluebird 3.5.1
- body-parser 1.18.2
- dotenv 4.0.0
- elasticsearch 13.3.1
- express 4.16.2 
- pg 7.3.0
- sequelize 4.17.2
- sqs-consumer 3.8.0
- winston 2.4.0 

## System Overview 

![alt text](https://github.com/nehacp/mixtape81/user-interactions/system-overview.png " User Interactions Service");

