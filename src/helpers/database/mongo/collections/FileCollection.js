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

  static async GetAllFileInReverseOrder({ db }) {
    try {
      if (db) {
        const result = await db
          .collection(FileCollection.COLLECTION_NAME)
          .find({})
          .sort({ date: -1 })
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

  static async SearchByFileName({ db, fileName }) {
    try {
      if (db) {
        const result = await db
          .collection(FileCollection.COLLECTION_NAME)
          .find({
            $name: { $search: fileName },
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

  static async SearchByFileNameAndType({ db, fileName, fileType }) {
    try {
      if (db) {
        const result = await db
          .collection(FileCollection.COLLECTION_NAME)
          .find({
            $and: [
              { $name: { $search: fileName } },
              { $type: { $eq: fileType } },
            ],
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
