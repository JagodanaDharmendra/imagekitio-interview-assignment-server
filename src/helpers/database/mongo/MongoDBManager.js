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
    await FolderCollection.AddFileIdInArray({
      db: data.db,
      parentFolderId: data.folderId,
      fileId: data.fileId,
    });

    return await FolderCollection.RecountFolderSize({
      db: MongoDBManager.DB,
      folderId: parentFolderId,
      sizeDifference: size,
    });
  }

  static async GetAllFileInOrder({ folderId, reverse }) {
    const result = await FileCollection.GetAllFileInOrder({
      db: MongoDBManager.DB,
      folderId,
      reverse,
    });
    return result;
  }

  static async GetAllFolderData() {
    const result = await FolderCollection.GetAllFolderData({
      db: MongoDBManager.DB,
    });
    return result;
  }

  static async GetTotalSizeOfFolder({ folderId }) {
    const result = await FolderCollection.GetTotalSizeOfFolder({
      db: MongoDBManager.DB,
      folderId,
    });
    return result;
  }

  static async DeleteFolder({ folderId }) {
    let folderData = (await this.GetFolderData({ folderId })).data;
    // console.log(folderData);
    if (folderData) {
      await FolderCollection.DeleteFoldersDataFromArray({
        db: MongoDBManager.DB,
        parentFolderId: folderData.parentFolderId,
        folderId,
      });

      let mFoldersList = (
        await FolderCollection.GetChildFolders({
          db: MongoDBManager.DB,
          folderId: folderId,
        })
      ).data;

      await FolderCollection.DeleteFolders({
        db: MongoDBManager.DB,
        folders: mFoldersList,
      });

      await FileCollection.DeleteFilesByFolders({
        db: MongoDBManager.DB,
        folders: mFoldersList,
      });

      return await FolderCollection.RecountFolderSize({
        db: MongoDBManager.DB,
        folderId: folderData.parentFolderId,
        sizeDifference: -folderData.size,
      });
    } else {
      return {
        success: false,
        error: "There is no folder with given data",
      };
    }
  }

  static async DeleteFile({ fileId }) {
    let fileData = (await this.GetFileData({ fileId })).data;
    if (fileData) {
      await FolderCollection.DeleteFilesDataFromArray({
        db: MongoDBManager.DB,
        folderId: fileData.folderId,
        fileId,
      });

      await FileCollection.DeleteFileById({
        db: MongoDBManager.DB,
        fileId,
      });

      return await FolderCollection.RecountFolderSize({
        db: MongoDBManager.DB,
        folderId: fileData.folderId,
        sizeDifference: -fileData.size,
      });
    } else {
      return {
        success: false,
        error: "No Data Found to delete",
      };
    }
  }

  static async SearchFile({ fileName, fileType }) {
    const result = await FileCollection.SearchFile({
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

  static async GetFolderData({ folderId }) {
    const result = await FolderCollection.GetFolderDataById({
      db: MongoDBManager.DB,
      folderId: folderId,
    });
    return result;
  }

  static async GetFileData({ fileId }) {
    const result = await FileCollection.GetFileData({
      db: MongoDBManager.DB,
      fileId,
    });
    return result;
  }
}
module.exports = MongoDBManager;
