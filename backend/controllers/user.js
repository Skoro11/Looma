export async function RegisterUser(req, res) {
  const { username, email, password } = req.body;

  console.log(username, email, password);
}
