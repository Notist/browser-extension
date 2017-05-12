import _ from 'underscore';
// import FB from 'fb';

function done() {
  console.log('done');
  console.log(arguments);
  initializeExplore(arguments[0]);
}

function progress() {
  // TODO implement some type of progress bar
  console.log(arguments);
}

function onClick(ev) {
  getAllFriendScores2(done, progress);
}

window.addEventListener('load', (event) => {
  document.querySelector('button').addEventListener('click', onClick);
}, false);

function initializeExplore(friends) {
  // compute user's explore number
  let total = 0;

  const scores = [];
  const page_scores = {};
  const page_likes = {};

  _.each(friends, (user) => {
    if (!isNaN(user.score)) {
      total += user.score;
      scores.push(user.score);
      _.each(user.pages, (page) => {
        if (page_scores[page.page_id]) {
          page_scores[page.page_id] = ((page_scores[page.page_id] * page_likes[page.page_id]) + user.score) / (page_likes[page.page_id] + 1);
          page_likes[page.page_id] = page_likes[page.page_id] + 1;
        } else {
          page_scores[page.page_id] = user.score;
          page_likes[page.page_id] = 1;
        }
      });
    }
  });
  console.log(page_scores);

  const explore_num = total / scores.length;
  console.log('Explore number', explore_num);

  // compute standard deviation
  const squareDiffs = scores.map((value) => {
    const diff = value - explore_num;
    const sqr = diff * diff;
    return sqr;
  });

  const avgSquareDiff = average(squareDiffs);
  const std_dev = Math.sqrt(avgSquareDiff);
  console.log('Standard Deviation', std_dev);

  // find users with score in range of epxlorenum+/-std_dev, return pge Ids
  const factor = std_dev * 2;
  const optimal = ((explore_num + factor) < 2) ? explore_num + factor : (((explore_num - factor) > 0) ? explore_num - factor : 1);
  console.log('Looking for someone with score closest to', optimal);

  let diff = 4;
  let oldcurr,
    curr;
  _.each(page_scores, (page, index) => {
    const newdiff = Math.abs(page - optimal);
    if (newdiff < diff) {
      diff = newdiff;
      oldcurr = curr;
      curr = index;
    }
  });
  console.log(curr);
  console.log(oldcurr);

  // make call to API to save user Explore Number and std_dev
  // chrome.runtime.sendMessage({type: , explore_num: explore_num, std_dev: std_dev})

  // make call to our API to make call to FB API to find articles from specific pages
  // chrome.runtime.sendMessage({})
}

function average(data) {
  const sum = data.reduce((sum, value) => sum + value, 0);
  const avg = sum / data.length;
  return avg;
}
