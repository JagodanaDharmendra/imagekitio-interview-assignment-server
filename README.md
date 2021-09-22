``In order to understand how all things working, You have to look at classes and files where all logic resides in the helper folders.
``

``Below data is just to learn about how things work, You can not get things like, how data passed to the query and from where the data is coming.
``
# Database Schema:

## Files Table Schema:
```
{
    "fileId": string,
    "folderId": string,
    "name": string,
    "size": number,
    "dim": {
        "h": number,
        "w": number
    },
    "type": string,
    "src": urlString,
    "date": utcTimeString
}
```

## Folders Table Schema:
```
{   
    "folderId": string,
    "path": string,
    "name": string,
    "size": number,
    "files": array<string>,
    "folders": array<string>,
    "parentFolderId": string,
    "date": utcTimeString
}
```

# Queries:

## a. Insert a new folder or file at any level (root or inside a folder)

### Create Folder
```
db.collection("Folders").insertOne({
    folderId: mFolderId,
    path: mPath,
    name: mName,
    size: mSize,
    files: mFiles,
    folders: mFolders,
    parentFolderId: mParentFolderId,
    date: new Date().toISOString()
})
```

### Create File
```
db.collection("Files").insertOne({
    fileId: mFileId,
    folderId: mFolderId,
    name: mName,
    size: mSize,
    dim: mDimObj,
    type: mType,
    src: mSrc,
    date: new Date().toISOString(),
})
```


## b. Get list of all files reverse sorted by date

```
db.collection("Files")
    .find({})
    .sort({ date: -1 })
    .toArray()
```

## c. Find the total size of a folder (like total size of files contained in Folder2 which would include size of files File3.jpg and File4.txt)

```
db.collection("Folders").findOne(
    { folderId: folderId },
    { size: 1 , _id: 1},
)
```

## d. Delete a folder

```
db.collection("Folders").deleteMany({
    folderId: { $in: [...folders] },
});
```
where folder is list of folder to delete and its child and grand child folders.

## e. Search by filename and 
## f. Search for files with name “File1” and format = PNG

```
db.collection("Files").find({
    $and: [
    {
        name: { $regex: fileName ?? `.*`},
    },
    {
        type: { $regex: fileType ?? `.*` },
    },
    ]
}).toArray()
```

You can search by FileName("File_0", "File_1", or starting/ending with "File_1") and/or 
FileType ("PNG", "JPEG" or any sub-chars.)

## g. Rename SubFolder2 to NestedFolder2

```
db.collection("Folders").updateOne(
    { folderId: mFolderId },
    { $set: { name: mNewName } },
)
```

``
Thank you.
Dharmendra Jagodana
``