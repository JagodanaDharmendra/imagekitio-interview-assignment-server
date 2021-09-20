class FileCollection {
  static COLLECTION_NAME = "files";

  static async CreateFile({
    db,
    folderId,
    fileId,
    name,
    size,
    dim,
    type,
    src,
  }) {
    try {
      if (db) {
        const result = await db
          .collection(FileCollection.COLLECTION_NAME)
          .insertOne({
            fileId: fileId,
            folderId: folderId,
            name: name,
            size: size,
            dim: dim,
            type: type,
            src: src,
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

  static async GetFileById({ db, fileId }) {
    try {
      if (db) {
        const result = await db
          .collection(FileCollection.COLLECTION_NAME)
          .findOne({
            fileId: fileId,
          });
        return {
          error: false,
          success: true,
          result: result,
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

  static async GetAllFileInOrder({ db, folderId, reverse }) {
    try {
      if (db) {
        const queryObj = folderId == null ? {} : { folderId: folderId };
        const sortObj = { date: reverse ? -1 : 1 };

        console.log(JSON.stringify(queryObj));
        console.log(JSON.stringify(sortObj));

        const result = await db
          .collection(FileCollection.COLLECTION_NAME)
          .find(queryObj)
          .sort(sortObj)
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

  static async DeleteFilesByFolders({ db, folders }) {
    try {
      if (db) {
        const result = await db
          .collection(FileCollection.COLLECTION_NAME)
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

  static async SearchFile({ db, fileName, fileType }) {
    try {
      if (db) {
        const nameQuery = {
          name: { $regex: fileName != null ? fileName : "//" },
        };

        const typeQuery = {
          type: { $regex: fileType != null ? fileType : "//" },
        };

        const result = await db
          .collection(FileCollection.COLLECTION_NAME)
          .find({
            $and: [nameQuery, typeQuery],
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

  static async GetFileData({ db, fileId }) {
    try {
      if (db) {
        const result = await db
          .collection(FileCollection.COLLECTION_NAME)
          .findOne({ fileId: fileId });
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

  static async DeleteFileById({ db, fileId }) {
    try {
      if (db) {
        const result = await db
          .collection(FileCollection.COLLECTION_NAME)
          .deleteOne({ fileId: fileId });
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

  static async DeleteAllFiles({ db }) {
    try {
      if (db) {
        const result = await db
          .collection(FileCollection.COLLECTION_NAME)
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

module.exports = FileCollection;
