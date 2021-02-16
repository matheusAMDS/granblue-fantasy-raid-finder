import { Router } from "express"

const routes = Router()

routes.get("/", (req, res) => {
  return res.json({ message: "Welcome to our API" })
})

export default routes