const cors = require("cors");
const express = require("express");
const axios = require('axios').default;

const app = express();

const port = process.env.SERVER_PORT;
const corsConfig = {
  origin: [
    "http://localhost:1234",
    "https://web3.atomic-lab.io",
  ],
  methods: "GET,OPTION,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsConfig));

const livePeerURL = "https://livepeer.studio/api/stream";

app.get("/api/stream-list", async (request, response) => {
  axios.get(`${livePeerURL}?streamsonly=1`, {
    headers: {
      'Authorization': `Bearer ${process.env.LIVEPEER_API_KEY}`,
      'Content-Type': 'application/json',
    }
  }).then(function (result) {
    // handle success
    return response.json({ data: result.data });
  }).catch(function (error) {
    // handle error
    console.log(error);
    return response.json({ error });
  });
});

/**
 * Create new stream
 * @method GET
 */
app.post("/api/create-stream", async (request, response) => {
  axios.post(`${livePeerURL}`, {
    name: request.body.name,
    profiles: request.body.profiles
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.LIVEPEER_API_KEY}`,
      'Content-Type': 'application/json',
    }
  }).then(function (result) {
    // handle success
    return response.json({ data: result.data });
  }).catch(function (error) {
    // handle error
    console.log(error);
    return response.json({ error });
  });

  // try {
  //   // const response = await fetch(livePeerURL, {
  //   //   method: 'POST',
  //   //   headers: {
  //   //     Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
  //   //     'Content-Type': 'application/json'
  //   //   },
  //   //   body: JSON.stringify({
  //   //     name,
  //   //     profiles
  //   //   })
  //   // });
  //
  //   const data = await response.json()
  //   return response.json({ data: data });
  // } catch (error) {
  //   console.log(error);
  //   return response.json({ error: error });
  // }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
