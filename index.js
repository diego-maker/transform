import axios from 'axios';
import fs from 'fs';


const apiKey = 'A52HMwF6VgCKF2BGF9W4-z9iT9xGp5LJvKnVT0cQVUF_';
const url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/1e170d60-08a1-40b1-b250-1ea6ba0c2407';

axios({
  method: 'post',
  url: `${url}/v1/synthesize?voice=pt-BR_IsabelaV3Voice`,
  responseType: 'stream',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'audio/wav',
    'Authorization': `Basic ${Buffer.from(`apikey:${apiKey}`).toString('base64')}`
  },
  data: {
    text: 'ola mundo'
  }
})
  .then(response => {
    response.data.pipe(fs.createWriteStream('hello_world.wav'))
  })
  .catch(error => {
    console.log(error);
  });