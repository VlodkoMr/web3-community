const cors = require("cors");
const express = require("express");
const request = require('request');

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

app.get("/api/stream-list", async (req, response) => {
  const options = {
    json: true,
    headers: {
      Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  request(`${livePeerURL}?streamsonly=1`, options, (error, res, body) => {
    if (error) {
      return response.json({ error });
    }

    if (!error && res.statusCode === 200) {
      console.log(`body`, body);
      return response.json({ data: body });
    }
  });
});

/**
 * Create new stream
 * @method GET
 */
app.post("/api/create-stream", async (req, response) => {
  const headers = {
    Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
    // 'Content-Type': 'application/json',
  };

  const form = {
    name: req.body.name,
    profiles: req.body.profiles
  };

  request.post({ url: `${livePeerURL}`, form: form, headers: headers }, (error, res, body) => {
    console.log(`error`, error);
    console.log(`body`, body);

    if (error) {
      return response.json({ error });
    }

    if (!error && res.statusCode === 200) {
      console.log(`body`, body);
      return response.json({ data: body });
    }
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
