import express from 'express'
import axios from 'axios';
import fs from 'fs';
const router = express.Router();


router.post("/", (req, res) => {
  let body = req.body;
  body.text = body.text+'devDiego';

  // const hash = crypto.createHash('sha256').update(body.text).digest('hex'); // essa validação eu vou realizar no envio

  if (req.body.acess_token == 'ec1ca3c9a7995b19f28d5e9f193ef518ddd8e0148f28a2cf0450559c3cb2b969' ) {
    
    let text = req.body.text
   
    axios({
      method: 'post',
      url: `${process.env.URL_KEY}/v1/synthesize?voice=pt-BR_IsabelaV3Voice`,
      responseType: 'stream',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'audio/wav',
        'Authorization': `Basic ${Buffer.from(`apikey:${process.env.API_KEY}`).toString('base64')}`
      },
      data: {
        text: text
      }
    })
      .then(response => {
        res.sendStatus(200);
        response.data.pipe(fs.createWriteStream('GPTaudio.wav'))
      })
      .catch(error => {
        res.sendStatus(error);
      });

  } else {
    res.sendStatus(404);
  }
});

router.get("/", (req, res) => {
 
  const challenge = {
    name: 'transform text in voice',
    version: '0.0.1',
    author_api:'diegoDev',

  };
    res.status(200).send(challenge);
  
});

export default router;
