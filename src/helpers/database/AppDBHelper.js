var MongoDBManager = require("./mongo/MongoDBManager");
class AppDBHelper {
  static async Connect() {
    await MongoDBManager.connect({
      onSuccess() {
        console.log("onSuccess");
      },
      onFailed() {
        console.log("onFailed");
      },
    });
  }

  static async GenerateDummy() {
    const totalToGenerate = 50;
    {
      //create dummy folders
      let currentId = 0;
      for (let iPos = 0; iPos < totalToGenerate; iPos++) {
        let random;
        do {
          random = Math.floor(Math.random() * (currentId + 1));
        } while (iPos != 0 && random === iPos);
        const obj = {
          name: `Folder_${currentId}`,
          path: `Folder_${currentId}`,
          parentFolderId: currentId == 0 ? "root" : `Folder_${random}`,
        };
        await this.CreateFolder(obj);
        currentId++;
      }
    }

    {
      //create dummy files
      const fileTypes = ["PNG", "JPG", "TIFF", "MOV"];
      for (let iPos = 0; iPos < totalToGenerate; iPos++) {
        const randomNumber = Math.random();
        const random = Math.floor(randomNumber * totalToGenerate);
        const randomFileType = Math.floor(
          randomNumber * (fileTypes.length + 1)
        );
        const randomSize = Math.floor(randomNumber * 1000);
        const obj = {
          name: `File_${iPos}`,
          parentFolderId: `Folder_${random}`,
          dim: { h: 10, w: 10 },
          type: fileTypes[randomFileType],
          size: randomSize,
          src: "",
        };
        await this.CreateFile(obj);
      }
    }
  }

  static async CreateFolder({ name, path, parentFolderId }) {
    console.log("CreateFolder " + name + " " + path + " " + parentFolderId);

    let result = null;

    {
      //mongoDB
      result = await MongoDBManager.CreateFolder({
        name,
        path,
        parentFolderId,
      });
    }

    return result;
  }

  static async CreateFile({ name, size, dim, type, src, parentFolderId }) {
    console.log(
      "CreateFile " +
        name +
        " " +
        size +
        " " +
        dim.toString() +
        " " +
        type +
        " " +
        src +
        " " +
        parentFolderId
    );

    let result = null;

    {
      //mongoDB
      result = await MongoDBManager.CreateFile({
        name,
        size,
        dim,
        type,
        src,
        parentFolderId,
      });
    }

    return result;
  }
  static async GetAllFileInOrder({ folderId, reverse }) {
    console.log("GetAllFileInOrder ");
    //get all files record from databases in reverse order by added date

    let result = null;

    {
      //mongoDB
      result = await MongoDBManager.GetAllFileInOrder({ folderId, reverse });
    }

    return result;
  }

  static async GetTotalSizeOfFolder({ folderId }) {
    console.log("GetTotalSizeOfFolder " + folderId);
    let result = null;

    {
      //mongoDB
      result = await MongoDBManager.GetTotalSizeOfFolder({ folderId });
    }

    return result;
  }

  static async DeleteFolder({ folderId }) {
    console.log("DeleteFolder " + folderId);

    let result = null;

    {
      //mongoDB
      result = await MongoDBManager.DeleteFolder({ folderId });
    }

    return result;
  }

  static async DeleteFile({ fileId }) {
    console.log("DeleteFile " + fileId);

    let result = null;

    {
      //mongoDB
      result = await MongoDBManager.DeleteFile({ fileId });
    }

    return result;
  }

  static async SearchFile({ fileName, fileType }) {
    console.log("SearchFile " + fileName + " " + fileType);

    let result = null;

    {
      //mongoDB
      result = await MongoDBManager.SearchFile({
        fileName,
        fileType,
      });
    }

    return result;
  }

  static async RenameFolder({ folderId, newName }) {
    console.log("RenameFolder " + folderId + " " + newName);

    let result = null;

    {
      //mongoDB
      result = await MongoDBManager.RenameFolder({ folderId, newName });
    }

    return result;
  }

  static async DeleteAllFolders() {
    console.log("DeleteAllFolders ");

    let result = null;

    {
      //mongoDB
      result = await MongoDBManager.DeleteAllFolders();
    }

    return result;
  }

  static async DeleteAllFiles() {
    console.log("DeleteAllFiles ");

    let result = null;

    {
      //mongoDB
      result = await MongoDBManager.DeleteAllFiles();
    }

    return result;
  }

  static async GetRootFolderData() {
    return await AppDBHelper.GetFolderData({ folderId: "Folder_0" });
  }

  static async GetFolderData({ folderId }) {
    console.log("GetFolderData " + folderId);

    let result = null;

    {
      //mongoDB
      result = await MongoDBManager.GetFolderData({ folderId });
    }

    return result;
  }
}

module.exports = AppDBHelper;
