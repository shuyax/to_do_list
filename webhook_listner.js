const express = require('express');
const bodyParser = require('body-parser');
const exec = require('child_process').exec;

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  if (req.body.ref === 'refs/heads/main') { // Adjust branch as needed
    exec('sh /home/shuya/to_do_list/deploy.sh', (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return res.status(500).send('Deployment failed');
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res.status(200).send('Deployment successful');
    });
  } else {
    res.status(400).send('Invalid branch');
  }
});

app.listen(3030, () => {
  console.log('Webhook listener running on port 3000');
});
