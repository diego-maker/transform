import express from 'express'
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const router = express.Router();


router.post("/", (req, res) => {


  if (req.body.acess_token == process.env.VALIDATE_TOKEN) {

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
        // Verifique se o arquivo existe
        if (fs.existsSync('GPTaudio.mp3')) {
          // Exclua o arquivo existente
          fs.unlinkSync('GPTaudio.mp3');
        }

        response.data.pipe(fs.createWriteStream('GPTaudio.mp3'))
      })
      .catch(error => {
        res.sendStatus(error);
      });

  } else {
    res.sendStatus(404);
  }
});

router.get("/", (req, res) => {
  const filePath = path.join(process.cwd(), 'GPTaudio.mp3');
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mp3',
    };

    head['Cache-Control'] = 'no-cache, no-store, must-revalidate';

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mp3',
    };

    head['Cache-Control'] = 'no-cache, no-store, must-revalidate';

    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});



export default router;
