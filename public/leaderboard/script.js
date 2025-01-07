const leaderboardTable = document.querySelector("#leaderboardTable");

const fetchUsers = () => {
  fetch("/users")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      leaderboardTable.innerHTML = "";
      console.log(response);

      let position = 1;

      for (let user of response) {
        const row = document.createElement("tr");

        const rank = document.createElement("td");
        rank.innerText = position;
        rank.setAttribute("class", "textColour");

        position = position + 1;
        row.append(rank);

        const username = document.createElement("td");
        username.setAttribute("class", "textColour");
        username.innerText = user.character_name;
        row.append(username);

        const score = document.createElement("td");
        score.setAttribute("class", "textColour");
        score.innerText = user.high_score;
        row.append(score);

        leaderboardTable.append(row);
      }
    });
};

fetchUsers();

setInterval(fetchUsers, 5000);
