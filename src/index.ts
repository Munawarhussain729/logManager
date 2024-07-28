import app from "./app"
const PORT = process.env.port || 3000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})