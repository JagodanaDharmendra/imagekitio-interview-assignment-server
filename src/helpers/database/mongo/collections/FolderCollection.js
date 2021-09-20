class FolderCollection {
  static COLLECTION_NAME = "folders";

  static async CreateFolder({
    db,
    folderId,
    path,
    name,
    size,
    files,
    Folders,
    ParentFolderId,
  }) {
    try {
      if (db) {
        const result = await db
          .collection(FolderCollection.COLLECTION_NAME)
          .insertOne({
            folderId: folderId,
            path: path,
            name: name,
            size: size,
            files: files,
            Folders: Folders,
            ParentFolderId: ParentFolderId,
            date: new Date().toISOString(),
          });
        return {
          error: false,
          success: true,
          data: result,
        };
      } else {
        return {
          error: "Database connection lost",
          success: false,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        error: e,
        success: false,
      };
    }
  }

  static async GetFolderById({ db, folderId }) {
    try {
      if (db) {
        const result = await db
          .collection(FolderCollection.COLLECTION_NAME)
          .findOne({
            folderId: folderId,
          });
        return {
          error: false,
          success: true,
          data: result,
        };
      } else {
        return {
          error: "Database connection lost",
          success: false,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        error: e,
        success: false,
      };
    }
  }

  static async GetTotalSizeOfFolder({ db, folderId }) {
    const result = await FolderCollection.GetFolderById({ db, folderId });
    if (result && result.success) {
      return {
        success: true,
        data: result.data?.size ?? 0,
      };
    }

    return {
      success: false,
      data: 0,
    };
  }

  static async DeleteFolders({ db, folders }) {
    try {
      if (db) {
        const result = await db
          .collection(FolderCollection.COLLECTION_NAME)
          .deleteMany({
            folderId: { $in: [...folders] },
          });
        return {
          error: false,
          success: true,
          data: result,
        };
      } else {
        return {
          error: "Database connection lost",
          success: false,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        error: e,
        success: false,
      };
    }
  }

  static async GetChildFolders({ db, folderId }) {
    try {
      if (db) {
        const folderList = new Set();
        folderList.add(folderId);
        const query = { folderId: { $in: folderList.values() } };
        const result = await db
          .collection(FolderCollection.COLLECTION_NAME)
          .find(query, {
            projection: { folders: 1 },
          })
          .toArray();
        return {
          error: false,
          success: true,
          data: result,
        };
      } else {
        return {
          error: "Database connection lost",
          success: false,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        error: e,
        success: false,
      };
    }
  }

  static async RenameFolder({ db, folderId, newName }) {
    try {
      if (db) {
        const query = { folderId: folderId };
        const update = { $set: { name: newName } };
        const result = await db
          .collection(FolderCollection.COLLECTION_NAME)
          .updateOne(query, update);
        return {
          error: false,
          success: true,
          data: result,
        };
      } else {
        return {
          error: "Database connection lost",
          success: false,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        error: e,
        success: false,
      };
    }
  }

  static async AddFolderIdInArray({ db, parentFolderId, folderId }) {
    try {
      if (db) {
        const query = { folderId: parentFolderId };
        const update = { $push: { folders: folderId } };
        const result = await db
          .collection(FolderCollection.COLLECTION_NAME)
          .updateOne(query, update);
        return {
          error: false,
          success: true,
          data: result,
        };
      } else {
        return {
          error: "Database connection lost",
          success: false,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        error: e,
        success: false,
      };
    }
  }

  static async AddFileIdInArray({ db, parentFolderId, fileId }) {
    try {
      if (db) {
        const query = { folderId: parentFolderId };
        const update = { $push: { files: fileId } };
        const result = await db
          .collection(FolderCollection.COLLECTION_NAME)
          .updateOne(query, update);
        return {
          error: false,
          success: true,
          data: result,
        };
      } else {
        return {
          error: "Database connection lost",
          success: false,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        error: e,
        success: false,
      };
    }
  }

  static async DeleteAllFolders({ db }) {
    try {
      if (db) {
        const result = await db
          .collection(FolderCollection.COLLECTION_NAME)
          .remove();
        return {
          error: false,
          success: true,
          data: result,
        };
      } else {
        return {
          error: "Database connection lost",
          success: false,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        error: e,
        success: false,
      };
    }
  }
}

module.exports = FolderCollection;
