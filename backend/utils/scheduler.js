const cron = require("node-cron");
const Post = require("../models/Post");
// Every minute: flip any scheduled posts whose time has come to "Posted".
// Since we simulate publishing, this just updates status.
function startScheduler() {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const due = await Post.find({
        status: "Scheduled",
        scheduledDate: { $lte: now },
      });
      for (const p of due) {
        p.status = "Posted";
        await p.save();
        console.log(`[scheduler] Published post ${p._id}`);
      }
    } catch (err) {
      console.error("[scheduler] error", err.message);
    }
  });
  console.log("Scheduler started (runs every minute)");
}
module.exports = startScheduler;