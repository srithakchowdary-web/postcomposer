const LIMITS = {
  X: 280,
  Instagram: 2200,
  LinkedIn: 3000,
  Facebook: 63000,
};
function validatePost({ content, platforms }) {
  const errors = [];
  if (!content || !content.trim()) {
    errors.push("Post content cannot be empty");
  }
  if (!Array.isArray(platforms) || platforms.length === 0) {
    errors.push("Select at least one platform");
  } else {
    for (const p of platforms) {
      const limit = LIMITS[p];
      if (!limit) {
        errors.push(`Unknown platform: ${p}`);
        continue;
      }
      if (content && content.length > limit) {
        errors.push(
          `${p}: Character limit exceeded (${limit} allowed, ${content.length} entered)`
        );
      }
    }
  }
  return errors;
}
module.exports = { validatePost, LIMITS };