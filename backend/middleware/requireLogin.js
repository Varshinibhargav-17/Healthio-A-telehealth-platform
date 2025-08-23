export default function requireLogin(req, res, next) {
  if (req.session && (req.session.user || req.session.providerId)) {
    next();
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
}
