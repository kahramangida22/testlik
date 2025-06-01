
import { resetLeaderboardWeekly } from './leaderboard.js';

function weeklyReset() {
  resetLeaderboardWeekly();
  console.log("Lider tablosu haftalık olarak sıfırlandı.");
}

// Bu dosya cron job olarak çalıştırılabilir
weeklyReset();
