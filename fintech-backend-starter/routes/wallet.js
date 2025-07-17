
const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user.id });
  res.json(wallet);
});

router.post('/send', auth, async (req, res) => {
  const { toUserId, amount } = req.body;
  const senderWallet = await Wallet.findOne({ userId: req.user.id });
  const receiverWallet = await Wallet.findOne({ userId: toUserId });

  if (!receiverWallet || senderWallet.balance < amount) {
    return res.status(400).json({ message: 'Transfer failed' });
  }

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;
  await senderWallet.save();
  await receiverWallet.save();
  res.json({ message: 'Transfer successful' });
});

module.exports = router;
