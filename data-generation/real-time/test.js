// data generation runs for history data
// when that finishes running, start script for live data update
// live data should be routed through http requests
// it should add data to database
// send same data to austin for analysis processing
// it should also send data to elastic search

// fix bug where if sessions are over 10000, how files are read

// 

// figure out what kind of data to put on message bus

// if its live data, i should receive x number of requests



// slow down script for live data
// make it every x seconds to add x entries


if (tooMany) {
  let start = 0;
  let incrementBy = 5000;
  let total = active.length;
  while (total > 0) {
    console.log('TOTAL IN ARCHIEVE', total);
    total -= 5000;
    triggerEventsOnSessions(active.slice(start, incrementBy));
    start += 5000;
    incrementBy += 5000;
    if (incrementBy >= active.length) {
      incrementBy = active.length + 1;
    }
  }
}

lastTimeStampPerRound = 1509769262858
lastTimeStamp = 1509769262858

lastSession = '3495379--7060--1509762542858--1509769262858';