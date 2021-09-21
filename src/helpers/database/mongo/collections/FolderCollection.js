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
        const result = await db.collection(this.COLLECTION_NAME).insertOne({
          folderId: folderId,
          path: path,
          name: name,
          size: size,
          files: files,
          folders: Folders,
          parentFolderId: ParentFolderId,
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

  static async GetAllFolderData({ db }) {
    try {
      if (db) {
        const result = await db
          .collection(this.COLLECTION_NAME)
          .find()
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

  static async GetFolderDataById({ db, folderId }) {
    try {
      if (db) {
        const result = await db.collection(this.COLLECTION_NAME).findOne({
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
    const result = await this.GetFolderDataById({ db, folderId });
    if (result && result.success) {
      return {
        success: result.data?.size != null,
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
        const result = await db.collection(this.COLLECTION_NAME).deleteMany({
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

  static async DeleteFoldersDataFromArray({ db, parentFolderId, folderId }) {
    try {
      if (db) {
        const result = await db
          .collection(this.COLLECTION_NAME)
          .updateOne(
            { folderId: parentFolderId },
            { $pull: { folders: folderId } }
          );
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

  static async DeleteFilesDataFromArray({ db, folderId, fileId }) {
    try {
      if (db) {
        const result = await db
          .collection(this.COLLECTION_NAME)
          .updateOne({ folderId: folderId }, { $pull: { files: fileId } });
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

  static difference(s1, s2) {
    if (!s1 instanceof Set || !s2 instanceof Set) {
      console.log("The given objects are not of type MySet");
      return null;
    }
    let newSet = new Set();
    s1.forEach((elem) => newSet.add(elem));
    s2.forEach((elem) => newSet.delete(elem));
    return newSet;
  }

  static async GetChildFolders({ db, folderId }) {
    try {
      if (db) {
        const visited = new Set();
        let nonVisited = new Set();
        nonVisited.add(folderId);
        do {
          const query = { folderId: { $in: [...nonVisited.values()] } };
          const result = await db
            .collection(this.COLLECTION_NAME)
            .find(query, {
              projection: { folders: 1 },
            })
            .toArray();
          nonVisited.forEach((X) => visited.add(X));
          nonVisited.clear();
          for (let iPos = 0; iPos < result.length; iPos++) {
            result[iPos].folders.forEach((v) => {
              nonVisited.add(v);
            });
          }
          if (nonVisited == null || nonVisited.size == 0) {
            break;
          }
          nonVisited = this.difference(nonVisited, visited);
        } while (true);
        const result = Array.from(visited).sort();
        console.log(result);
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
          .collection(this.COLLECTION_NAME)
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
          .collection(this.COLLECTION_NAME)
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
          .collection(this.COLLECTION_NAME)
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
        const result = await db.collection(this.COLLECTION_NAME).remove();
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

  // static async GetFolderData({ db, folderId }) {
  //   return await this.GetFolderDataById({
  //     db: db,
  //     folderId: folderId,
  //   });
  // }

  static async RecountFolderSize({ db, folderId, sizeDifference }) {
    try {
      if (db) {
        let currentFolderId = folderId;
        do {
          await db
            .collection(this.COLLECTION_NAME)
            .updateOne(
              { folderId: currentFolderId },
              { $inc: { size: sizeDifference } }
            );
          const folderResult = await this.GetFolderDataById({
            db,
            folderId: currentFolderId,
          });

          console.log(JSON.stringify(folderResult));

          const parentFolderId = folderResult.data?.parentFolderId ?? null;
          console.log(parentFolderId);

          if (parentFolderId == null || currentFolderId == parentFolderId) {
            break;
          } else {
            currentFolderId = parentFolderId;
          }
        } while (true);
        return {
          success: true,
        };
      } else {
        console.log("Database connection lost");
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
