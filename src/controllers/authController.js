class AuthController {
  async login(req, res) {
    try {
      res.send("login");
    } catch (error) {}
  }
}

export default new AuthController();
