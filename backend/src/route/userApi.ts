import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { displayBalance, createWallet,getTransactionHistory,makeTransaction } from '../../../blockchain/main';
import User from '../model/User'; // Ensure this path is correct



// const __filename = fileURLToPath(url);
// const __dirname = path.dirname(__filename);
const router = express.Router();

// Update username
router.get("/:userId/update", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name } = req.query;
  try {
    const updateUsername = await User.findOne({ userId });
    if (updateUsername) {
      updateUsername.name = name as string;
      await updateUsername.save();
      res.json({ success: true, message: "Your username is updated" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: "Something is wrong" });
  }
});

// API transact
router.get("/:userId/transact", async (req: Request, res: Response) => {
  const { name, amount } = req.query;
  const { userId } = req.params;
  try {
    const checkRUser = await User.findOne({ name: name as string });
    const checkSUser = await User.findOne({ userId });
    if (!checkRUser) return res.json({ success: false, message: "The username is outdated, please update" });
    if (!checkSUser || !checkSUser.publicKey) return res.json({ success: false, message: "The sender doesn't have a wallet, please create one" });
    if (!checkRUser.publicKey) return res.json({ success: false, message: "The receiver doesn't have a wallet, please create one" });
    const transaction = await makeTransaction(checkSUser.privateKey as string,checkRUser.publicKey as  string,Number(amount) as number)
    res.json({ success: true, message: `${checkSUser.name} has sent ${amount} SOL to ${checkRUser.name}`,signature: transaction });
  } catch (e) {
    res.status(500).json({ message: "Something wrong" });
  }
});

// API check balance
router.get("/:userId/checkBal", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const response = await User.findOne({ userId });
    if (response) {
      const checkBalance = await displayBalance(response.publicKey as string);
      
      res.json({
        success: true,
        message: "Your process is completed",
        checkBalance
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message:"Someting wrong" });
  }
});

// API create wallet
router.get("/:userId/create", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name } = req.query;
  try {
    const check = await User.findOne({ userId });
    if (!check) {
      const newWallet = await User.create({
        name: name as string,
        email: "default",
        publicKey: null,
        privateKey: null,
        balance: null,
        userId,
      });
       const create = await createWallet(); // Specify the actual URL
       newWallet.publicKey = create.publicKey;
      newWallet.privateKey = create.secretKey;
      await newWallet.save();
      res.json({
        success: true,
        message: "Your wallet has been successfully created",
      });
    } else {
      if (check.publicKey) {
        return res.json({
          success: false,
          message: "This user already has an account",
        });
      }
       const create = await createWallet(); // Specify the actual URL
       check.publicKey = create.publicKey;
       check.privateKey = create.secretKey;
      await check.save();
      res.json({
        success: true,
        message: "Your wallet has been successfully created",
      });
    }
  } catch (e) {
    res.status(500).json({ success: false, message:"Something wrong" });
  }
});

// API get History
router.get("/:userId/history", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const getUser = await User.findOne({ userId });
    if (getUser) {
       const getHistory = await getTransactionHistory(getUser.publicKey as string)
        console.log(getHistory)
      res.json({ success: true, data: getHistory });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: "Something is wrong" });
  }
});

export default router;
