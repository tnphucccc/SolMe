const { default: axios } = require("axios");
const User =require('../model/User')
const router = require("express").Router();
//api transact
router.get("/:userId", async (req, res) => {
  const { name, balance } = req.body;
  const { userId } = req.params;
  try {
    const response = axios.get();
    res.json({ success: true, message: "Your procecss is completed" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//api check balance
router.get("/:userId",async (req,res)=>{
    const {userId}=req.params
    try{
        const response = await User.findOne({userId})
        res.json({ success: true, message: "Your procecss is completed", data:response })
    }catch(e){
        res.status(500).json({error:e.message})
    }
})
//
module.exports = router;
