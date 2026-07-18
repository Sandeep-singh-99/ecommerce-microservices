import express from "express"
import dotenv from "dotenv"
dotenv.config();


const app = express()
const PORT = process.env.PORT || 50001

app.get('/health', (req, res) => {
    return res.status(200).json("Payment Service");
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})