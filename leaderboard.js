
let leaderboard = [];

export function updateLeaderboard(user, score) {
  const existing = leaderboard.find(u => u.name === user);
  if (existing) {
    existing.score += score;
  } else {
    leaderboard.push({ name: user, score });
  }
  leaderboard.sort((a, b) => b.score - a.score);
}

export function getTopUsers() {
  return leaderboard.slice(0, 10);
}

export function resetLeaderboardWeekly() {
  leaderboard = [];
}
