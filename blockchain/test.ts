// write a function to display the balance
import { displayBalance, getTransactionHistory, makeTransaction } from "./main";

// displayBalance("CoT2U8WaGhRytk8knRkUxwd2K41MhoCK31m6iJ4nDU59");
// makeTransaction(
//   "cd00851481ebef25f2c279c5d7b7a600b6b573c4161ea79982ba006019d76f7ab88bb9c59da0f2eaf8c2a6492f9369b8ae1f62b96b224fe8d2d5c6974ab909cf",
//   "DRPbFNor7BWxQdBANCU55MbJXefDDKqGPEDvYjd4HDqG",
//   0.01
// );
// displayBalance("DRPbFNor7BWxQdBANCU55MbJXefDDKqGPEDvYjd4HDqG");

//getTransactionHistory("DRPbFNor7BWxQdBANCU55MbJXefDDKqGPEDvYjd4HDqG");
// displayBalance("DRPbFNor7BWxQdBANCU55MbJXefDDKqGPEDvYjd4HDqG");
// displayBalance("DRPbFNor7BWxQdBANCU55MbJXefDDKqGPEDvYjd4HDqG");
// makeTransaction(
//   "8d8fe1b0c47662e8c7fc583cc8502e51f0d33a4e5f87f9c18ec1ad8762366bfeaf56b347d27986a9917cee2a455eab1a568d0fe149ed0c0db90fa461a529f00c",
//   "DRPbFNor7BWxQdBANCU55MbJXefDDKqGPEDvYjd4HDqG",
//   2.3
// );
displayBalance("CoT2U8WaGhRytk8knRkUxwd2K41MhoCK31m6iJ4nDU59");

//  Make a transaction (replace with valid secret key and destination wallet address)

async function testTransaction() {
  const senderSecretKey =
    "8d8fe1b0c47662e8c7fc583cc8502e51f0d33a4e5f87f9c18ec1ad8762366bfeaf56b347d27986a9917cee2a455eab1a568d0fe149ed0c0db90fa461a529f00c";
  const receiverPublicKey = "DRPbFNor7BWxQdBANCU55MbJXefDDKqGPEDvYjd4HDqG";
  const senderPublicKey = "CoT2U8WaGhRytk8knRkUxwd2K41MhoCK31m6iJ4nDU59";
  const amount = 1; // 0.01 SOL

  console.log("Sender balance before transaction:");
  await displayBalance(senderPublicKey);

  console.log("Receiver balance before transaction:");
  await displayBalance(receiverPublicKey);

  // Make the transaction
  await makeTransaction(senderSecretKey, receiverPublicKey, amount);

  console.log("Sender balance after transaction:");
  await displayBalance(senderPublicKey);

  console.log("Receiver balance after transaction:");
  await displayBalance(receiverPublicKey);
}

testTransaction();
