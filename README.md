# Oath.js

Oath is a utility library for promises. The methods exposed by Oath allow you
to accomplish tasks that would ordinarily require a non-trivial amount of work.

[![Build Status](https://travis-ci.org/mattbasta/oath.svg?branch=master)](https://travis-ci.org/mattbasta/oath)

```js
var oath = require('oath');

// Pass functions that return promises to rate limit
oath.rateLimit(2, [
    uploadFile('favicon.ico'),
    uploadFile('nope.gif'),
    uploadFile('oh_snap.jpg'),
    uploadFile('trololo.mp3')
]).then(function() {
    console.log('upload complete');
});


// Pass many promises and get the first resolution or rejection
oath.first(
    pingHostname1(),
    pingHostname2(),
    pingHostname3()
).then(function(hostname) {
    console.log(hostname + ' is the fastest');
}, function() {
    console.warn('The connection may be flaky');
});


setUpEnvironment().then(
    // Ignore promises that reject
    oath.ignore(
        tryToRefreshEmail(),
        updateRSSFeeds(),
        downloadNewCalendarEvents()
    )
).then(unlockUI);


// Perform data processing immediately
oath.map(
    [getPublicPosts(), getPrivatePosts(), getFriendsPosts()],
    function(posts) {
        // This will be called immediately for each passed promise
        // rather than after all promises have resolved.
        return posts.postData;
    }
).then(processAllPostData);


// Pass many promises and get only the first resolution
oath.any(
    pathFindFromMonsterToPlayer(),
    pathFindFromPlayerToMonster(),
    pathFindFromMinionToPlayer(),
    pathFindFromPlayerToMinion()
).then(function(path) {
    console.log(path + ' was found between the player and a monster');
}, function() {
    console.warn('There is no path between the player and a monster');
});

```
