var express = require("express");
var router = express.Router();

var AppDBHelper = require("../helpers/database/AppDBHelper");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const result = await AppDBHelper.GetRootFolderData();
  res.json(result);
});

router.get("/all", async function (req, res, next) {
  const result = await AppDBHelper.GetAllFolderData();
  res.json(result);
});

router.post("/create", async function (req, res, next) {
  const data = {
    name: req.body.name,
    path: req.body.path,
    parentFolderId: req.body.parentFolderId,
  };
  const result = await AppDBHelper.CreateFolder(data);
  res.json(result);
});

router.post("/delete", async function (req, res, next) {
  const data = {
    folderId: req.body.folderId,
  };
  const result = await AppDBHelper.DeleteFolder(data);
  res.json(result);
});

router.get("/size", async function (req, res, next) {
  const data = {
    folderId: req.body.folderId,
  };
  const result = await AppDBHelper.GetTotalSizeOfFolder(data);
  res.json(result);
});

router.get("/data/:id", async function (req, res, next) {
  const result = await AppDBHelper.GetFolderData({ folderId: req.params.id });
  res.json(result);
});

router.post("/rename", async function (req, res, next) {
  const data = {
    folderId: req.body.folderId,
    newName: req.body.newName,
  };
  const result = await AppDBHelper.RenameFolder(data);
  res.json(result);
});

module.exports = router;
