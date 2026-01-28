function validateCreatePaste(body) {
  const { content, ttl_seconds, max_views } = body;

  // content validation
  if (
    typeof content !== "string" ||
    content.trim().length === 0
  ) {
    return "content must be a non-empty string";
  }

  // ttl_seconds validation (optional)
  if (ttl_seconds !== undefined) {
    if (
      !Number.isInteger(ttl_seconds) ||
      ttl_seconds < 1
    ) {
      return "ttl_seconds must be an integer >= 1";
    }
  }

  // max_views validation (optional)
  if (max_views !== undefined) {
    if (
      !Number.isInteger(max_views) ||
      max_views < 1
    ) {
      return "max_views must be an integer >= 1";
    }
  }

  return null; // valid
}

module.exports = { validateCreatePaste };
