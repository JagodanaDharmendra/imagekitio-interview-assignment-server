var express = require("express");
var router = express.Router();

var AppDBHelper = require("../helpers/database/AppDBHelper");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const data = {
    folderId: req.body?.folderId ?? null,
    reverse: req.body?.reverse ?? false,
  };
  const result = await AppDBHelper.GetAllFileInOrder(data);
  res.json(result);
});

router.get("/search", async function (req, res, next) {
  const data = {
    fileName: req.body?.fileName ?? null,
    fileType: req.body?.fileType ?? null,
  };
  const result = await AppDBHelper.SearchFile(data);
  res.json(result);
});

router.post("/delete", async function (req, res, next) {
  const data = {
    fileId: req.body.fileId ?? "",
  };
  const result = await AppDBHelper.DeleteFile(data);
  res.json(result);
});

router.post("/create", async function (req, res, next) {
  const data = {
    name: req.body.name,
    size: req.body.size ?? 0,
    dim: req.body.dim ?? { h: 0, w: 0 },
    type: req.body.type ?? "",
    src: req.body.src ?? "",
    parentFolderId: req.body.parentFolderId,
  };
  const result = await AppDBHelper.CreateFile(data);
  res.json(result);
});

module.exports = router;
