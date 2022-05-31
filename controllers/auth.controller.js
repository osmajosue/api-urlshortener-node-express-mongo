export const register = (req, res) => {
    res.json({ "ok":"REGISTERED!" });
}

export const login = (req, res) => {
    //console.log(req.body);
    res.json({ "ok":"LOGGED IN!" });
}

