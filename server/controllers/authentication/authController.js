const bcrypt = require('bcryptjs')

const register = async (req, res, next) => {
    const db = req.app.get('database');
    const { first_name, last_name, email, username, password } = req.body;

    const checkedUser = await db.auth.get_user(username);
    if (checkedUser.length === 0) {
        const salt = bcrypt.genSaltSync(12);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const user = await db.auth.register_user([first_name, last_name, email, username, hashedPassword]);
        req.session.user = {
            id: user[0].user_id,
            username,
            first_name,
            last_name
        }
    } else {
        res.status(409).json({error: "Username taken, please try another."})
    }
}

const login = async (req, res) => {
    const db = req.app.get('database');
    const {username, password} = req.body;
    const checkedUser = await db.auth.get_user(username);
    if(checkedUser.length === 0) {
        res.status(401).json({error: "Wrong username or password."})
    }
    const isMatching = await bcrypt.compare(password, checkedUser[0].password)
    if (isMatching) {
        req.session.user = {
            id: checkedUser[0].user_id,
            username: checkedUser[0].username,
            first_name: checkedUser[0].first_name,
            last_name: checkedUser[0].last_name 
        }
        return res.json(req.session.user)
    } else {
        return res.status(403).json({error: "Wrong username or password."})
    }
}

const logout = (req, res) => {
    req.session.destry();
    res.status(200).json(req.session)
}

module.exports = {
    register,
    login,
    logout
}