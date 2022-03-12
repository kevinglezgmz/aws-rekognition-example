function sendRequest(method, endpoint, data) {
  return new Promise((success, reject) => {
    /**
     * The built-in class for sending HTTP requests.
     * @external XMLHttpRequest
     * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
     */
    const xhr = new XMLHttpRequest();
    xhr.open(method, endpoint, true);
    xhr.send(data);

    xhr.onload = () => {
      if (xhr.status != 200) {
        reject({ err: "Falló la petición al servidor con status: " + xhr.status + "." });
      } else {
        success(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject({ err: "Error al realizar la peticion." });
    };
  });
}

function showImage(input, id) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      /** @type { HTMLImageElement } */
      const imageElement = document.getElementById(id);
      imageElement.setAttribute("src", e.target.result);
      imageElement.height = 100;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

/** @type { HTMLFormElement } */
const imageLabelsForm = document.getElementById("form-labels");
/** @type { HTMLFormElement } */
const imageModerationForm = document.getElementById("form-moderation");
/** @type { HTMLFormElement } */
const imageCelebrityForm = document.getElementById("form-celebrity");

/** @type { HTMLUListElement } */
const labelsList = document.getElementById("labels-list");
/** @type { HTMLUListElement } */
const moderationList = document.getElementById("moderation-list");
/** @type { HTMLUListElement } */
const celebrityList = document.getElementById("celebrity-list");

imageModerationForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    const data = new FormData(imageModerationForm);
    sendRequest("POST", "moderation", data).then((response) => {
      const parsedResponse = JSON.parse(response);
      moderationList.innerHTML = parsedResponse.ModerationLabels.map((moderationLabel) => {
        return "<li> 👉 " + Number(moderationLabel.Confidence).toFixed(2) + "% - " + moderationLabel.Name + "</li>";
      }).join("");
    });
  },
  true
);

imageLabelsForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    const data = new FormData(imageLabelsForm);
    sendRequest("POST", "labels", data).then((response) => {
      const parsedResponse = JSON.parse(response);
      labelsList.innerHTML = parsedResponse.Labels.map((label) => {
        return "<li> 👉 " + Number(label.Confidence).toFixed(2) + "% - " + label.Name + "</li>";
      }).join("");
    });
  },
  true
);

imageCelebrityForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    const data = new FormData(imageCelebrityForm);
    sendRequest("POST", "celebrity", data).then((response) => {
      const parsedResponse = JSON.parse(response);
      console.log(parsedResponse);
      celebrityList.innerHTML = parsedResponse.CelebrityFaces.map((celebrityFace) => {
        return "<li> 👉 " + Number(celebrityFace.MatchConfidence).toFixed(2) + "% - " + celebrityFace.Name + "</li>";
      }).join("");
    });
  },
  true
);
