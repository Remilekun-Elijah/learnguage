exports.permissions = async () => {
  let permissions = await helper.getUserPermissions(req.headers.authorization);
  const isAdmin = permissions[0].find((data) => data === "admin");
  if (isAdmin) {
    // perform action
  } else {
    deleteFileFrom(req.files[0].path);
    res.json({ ok: false, status: 403, message: "You are not authorised!" });
  }
}
