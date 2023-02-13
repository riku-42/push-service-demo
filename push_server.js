const express = require('express');
const webpush = require('web-push');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const publicVapidKey = 'BAOIJSdtGzpjmlqyY_lDLFE9aEb7vbYO5drL_H2xnXKvltR2JtDmUnIgLuKt6ui0bh4xz_1cROvWv3UULd1_-Ck';
const privateVapidKey = 'N_w89gMxl92YnvjKoskovHloLVEYWfxsA_D6agpLwr0';

webpush.setVapidDetails(
  'mailto: <example@email.com>',
  publicVapidKey,
  privateVapidKey
);

let subscriptions = [];

app.get('/push/vapidkey', (req, res) => {
  console.log('Key request received.');
  res.send(publicVapidKey);
});

app.post('/push/register', (req, res) => {
  console.log('Register request received.');
  subscriptions.push(req.body);
  res.status(201).json({ message: 'Subscription added successfully.' });
});


const sendMessage = () => {
  console.log('sending message...');
  subscriptions.forEach(subscription => {
    console.log(subscription);
    webpush
      .sendNotification(subscription, JSON.stringify({ title: 'Push Test' }))
      .catch(error => {
        console.error(error.stack);
      });
  });
};

// Sending messages every 30 seconds
setInterval(sendMessage, 30 * 1000);

const port = 86;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
