import { User } from '../models/user.js';

export class UserService {
    async saveUser (user, res){
        const usuario = new User (user)
        try {
        
            await usuario.save();

            return res.status(201).json({"ok": `${user.email} registered succesfully`});

        } catch (error) {
            console.log(error);

            if (error.code === 11000) {
                return res.status(400).json({error: "The user already exists"});
            }
    
            return res.status(500).json({error: "Server Error"});
        }
    }

    async deleteUser (user, res) {
        try {
            const usr = await User.findOne({uid: user.uid});
            await User.deleteOne({ usr });

            return res.status(204).json({"ok": `OK`});

        } catch (error) {
            console.log(error);

            if (error.code === 11000) {
                return res.status(400).json({error: "The user does not exists"});
            }
    
            return res.status(500).json({error: "Server Error"});
        }
    }

    async getUserInfo (user, res) {
        const uid = user.uid;
        try {
            const usr = await User.findById(uid).lean();
            return res.json({ email: usr.email });
        } catch (error) {
            res.status(500).json({error: 'Non authenticated'});
        }
    }
}