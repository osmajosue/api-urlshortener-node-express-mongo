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
            const usuario = await User.findOne({uid: user.uid});
            await User.deleteOne({ usuario });

            return res.status(204);

        } catch (error) {
            console.log(error);

            if (error.code === 11000) {
                return res.status(400).json({error: "The user does not exists"});
            }
    
            return res.status(500).json({error: "Server Error"});
        }
    }
}