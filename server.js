const express = require("express");
const path = require("path");
const app = express();
const {
  RekognitionClient,
  RecognizeCelebritiesCommand,
  RecognizeCelebritiesCommandInput,
  DetectLabelsCommand,
  DetectLabelsCommandInput,
  DetectModerationLabelsCommand,
  DetectModerationLabelsCommandInput,
} = require("@aws-sdk/client-rekognition");
const fileUpload = require("express-fileupload");

const fileDirectory = path.join(__dirname, "public");
const client = new RekognitionClient({ region: "us-east-1" });

app.use("/", express.static(__dirname + "/public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: fileDirectory }, (err) => {
    res.end();
    if (err) throw err;
  });
});

app.post("/celebrity", async (req, res) => {
  /** @type { RecognizeCelebritiesCommandInput } */
  const params = {
    Image: {
      Bytes: req.files["celebrity-image"].data,
    },
  };
  try {
    const command = new RecognizeCelebritiesCommand(params);
    const response = await client.send(command);
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

app.post("/labels", async (req, res) => {
  /** @type { DetectLabelsCommandInput } */
  const params = {
    MaxLabels: 10,
    Image: {
      Bytes: req.files["labels-image"].data,
    },
  };
  try {
    const command = new DetectLabelsCommand(params);
    const response = await client.send(command);
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

app.post("/moderation", async (req, res) => {
  /** @type { DetectModerationLabelsCommandInput } */
  const params = {
    MaxLabels: 10,
    Image: {
      Bytes: req.files["moderation-image"].data,
    },
  };
  try {
    const command = new DetectModerationLabelsCommand(params);
    const response = await client.send(command);
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("App listening on port: ", process.env.PORT || 3000);
});
