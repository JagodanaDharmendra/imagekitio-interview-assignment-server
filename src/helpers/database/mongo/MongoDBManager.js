const { MongoClient } = require("mongodb");

var FolderCollection = require("./collections/FolderCollection");
var FileCollection = require("./collections/FileCollection");
class MongoDBManager {
  static DB_CONN_STRING =
    "mongodb+srv://dharmendra:imagekitio@cluster0.8wqwu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  static DB_NAME = "imagekitIO";

  static mDB;

  static async connect(callback) {
    try {
      const mClient = new MongoClient(MongoDBManager.DB_CONN_STRING);
      await mClient.connect();
      console.log("Connected successfully to server");
      MongoDBManager.mDB = mClient.db(MongoDBManager.DB_NAME);
      callback.onSuccess();
    } catch (e) {
      callback.onFailed();
    }
  }

  static get DB() {
    return MongoDBManager.mDB;
  }

  static async CreateFolder({ name, path, parentFolderId }) {
    const data = {
      db: MongoDBManager.DB,
      // folderId: UUID(),
      folderId: name,
      name: name,
      path: path,
      size: 0,
      files: [],
      Folders: [],
      ParentFolderId: parentFolderId,
    };
    await FolderCollection.CreateFolder(data);
    return await FolderCollection.AddFolderIdInArray({
      db: data.db,
      parentFolderId: data.ParentFolderId,
      folderId: data.folderId,
    });
  }

  static async CreateFile({ name, size, dim, type, parentFolderId, src }) {
    const data = {
      db: MongoDBManager.DB,
      // fileId: UUID(),
      fileId: name,
      folderId: parentFolderId,
      name: name,
      size: size,
      dim: dim,
      type: type,
      src: src,
    };
    await FileCollection.CreateFile(data);
    return await FolderCollection.AddFileIdInArray({
      db: data.db,
      parentFolderId: data.folderId,
      fileId: data.fileId,
    });
  }

  static async GetAllFileInReverseOrder() {
    const result = await FileCollection.GetAllFileInReverseOrder({
      db: MongoDBManager.DB,
    });
    return result;
  }

  static async GetTotalSizeOfFolder({ folderId }) {
    const result = await FolderCollection.GetTotalSizeOfFolder(folderId);
    return result;
  }

  static async DeleteFolder({ folderId }) {
    let result = await FolderCollection.GetChildFolders({
      db: MongoDBManager.DB,
      folderId: folderId,
    });
    if (result.success) {
      const mFoldersList = result.data;
      result = await FolderCollection.DeleteFolders({
        db: MongoDBManager.DB,
        folders: mFoldersList,
      });
      result = await FileCollection.DeleteFilesByFolders({
        db: MongoDBManager.DB,
        folders: mFoldersList,
      });
      return result;
    } else {
      return result;
    }
  }

  static async SearchByFileName({ fileName }) {
    const result = await FileCollection.SearchByFileName({
      db: MongoDBManager.DB,
      fileName,
    });
    return result;
  }

  static async SearchByFileNameAndType({ fileName, fileType }) {
    const result = await FileCollection.SearchByFileNameAndType({
      db: MongoDBManager.DB,
      fileName,
      fileType,
    });
    return result;
  }

  static async RenameFolder({ folderId, newName }) {
    const result = await FolderCollection.RenameFolder({
      db: MongoDBManager.DB,
      folderId,
      newName,
    });
    return result;
  }

  static async DeleteAllFolders() {
    const result = await FolderCollection.DeleteAllFolders({
      db: MongoDBManager.DB,
    });
    return result;
  }

  static async DeleteAllFiles() {
    const result = await FileCollection.DeleteAllFiles({
      db: MongoDBManager.DB,
    });
    return result;
  }
}
module.exports = MongoDBManager;
