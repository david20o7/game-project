const leaderboardTable = document.querySelector("#leaderboardTable");

// fetch leaderboard data from the server
const fetchUsers = () => {
  fetch("/leaderboardData")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      leaderboardTable.innerHTML = "";
      console.log(response);

      // create rank positions
      let position = 1;
      // loop through list of users
      for (let user of response) {
        const row = document.createElement("tr");
        // create rank cell
        const rank = document.createElement("td");
        rank.innerText = position;
        rank.setAttribute("class", "textColour");

        position = position + 1; // increment the rank position by 1
        row.append(rank);
        // create username cell
        const username = document.createElement("td");
        username.setAttribute("class", "textColour");
        username.innerText = user.username;
        row.append(username);
        // create highscore cell
        const score = document.createElement("td");
        score.setAttribute("class", "textColour");
        score.innerText = user.high_score;
        row.append(score);
        // add to leaderboard table the row
        leaderboardTable.append(row);
      }
    });
};

fetchUsers();
// update leaderboard every 5 seconds
setInterval(fetchUsers, 5000);
