const express = require("express");
const path = require("path");
const bs58 = require('bs58');
const { Keypair, Connection, sendAndConfirmTransaction, clusterApiUrl, PublicKey, Transaction, SystemProgram } = require("@solana/web3.js");

const SECRET_KEY = Uint8Array.from([56, 187, 141, 213, 200, 135, 140, 10, 39, 220, 46, 104, 249, 123, 134, 153, 3, 210, 144, 216, 91, 65, 210, 196, 236, 243, 139, 102, 131, 35, 225, 26, 74, 36, 215, 52, 36, 105, 185, 66, 43, 39, 229, 214, 167, 96, 124, 119, 106, 101, 1, 43, 163, 255, 146, 87, 254, 116, 172, 91, 50, 85, 87, 163]);

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const app = express();
app.use(express.json());

const PORT = 3000;
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route để xử lý yêu cầu đổi điểm
app.post('/redeem', async (req, res) => {
  const { score, walletPublicKey } = req.body;

  // Kiểm tra xem điểm và ví có hợp lệ không
  if (typeof score !== 'number' || score <= 0) {
    return res.status(400).json({ success: false, message: "Điểm không hợp lệ." });
  }
  if (!walletPublicKey) {
    return res.status(400).json({ success: false, message: "Ví công khai không hợp lệ." });
  }

  try {
    // Kết nối đến mạng Solana
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Ví game (private key của ví hệ thống)
    const senderPrivateKey = Uint8Array.from([56, 187, 141, 213, 200, 135, 140, 10, 39, 220, 46, 104, 249, 123, 134, 153, 3, 210, 144, 216, 91, 65, 210, 196, 236, 243, 139, 102, 131, 35, 225, 26, 74, 36, 215, 52, 36, 105, 185, 66, 43, 39, 229, 214, 167, 96, 124, 119, 106, 101, 1, 43, 163, 255, 146, 87, 254, 116, 172, 91, 50, 85, 87, 163]); // Khóa riêng của ví game
    const senderKeypair = Keypair.fromSecretKey(senderPrivateKey);

    // Public key của ví người dùng
    const receiverPublicKey = new PublicKey(walletPublicKey);

    // Tính số lượng SOL cần gửi (1 điểm = 0.1 SOL)
    const tokenAmount = score * 0.1;
    const lamports = tokenAmount * 1e9; // Chuyển đổi SOL sang lamports

    console.log(`Gửi ${lamports} lamports từ ví Phantom đến ví người dùng`);

    // Tạo giao dịch chuyển SOL từ ví game vào ví người dùng
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: receiverPublicKey,
        lamports: lamports,
      })
    );

    // Ký và gửi giao dịch
    const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);

    // Trả về kết quả thành công
    res.status(200).json({
      success: true,
      tokenAmount: tokenAmount,
      transactionSignature: signature,
    });
  } catch (error) {
    console.error("Lỗi khi gửi token:", error);
    res.status(500).json({ success: false, message: "Lỗi khi gửi token.", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
