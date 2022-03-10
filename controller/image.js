import fs from "fs";
import { URLSever } from "../index.js"
export const postImage = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: "Please upload a file." });
  } else {
    const image = {
      path: `${URLSever}/images/${file.filename}`,
      index: req.body.index,
      filename: file.filename,
    };
    res.status(200).json(image);
  }
};

export const deleteImage = async (req, res) => {

  const filename = req.body.filename;
  fs.unlink(`./images/${filename}`, function (err, data) {
    if (err) throw err;
    res.status(200).send("Delete file successfully");
  });

};

export const deleteImages = async (req, res) => {

  const paths = req.body;

  paths.forEach(path =>{
    fs.unlink(`./images/${path.filename}`, function (err, data) {
      if (err) throw err
    });
  })

  res.status(200).send("Delete images successfully");

};
