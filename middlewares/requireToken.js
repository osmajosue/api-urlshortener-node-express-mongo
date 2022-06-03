import jwt from "jsonwebtoken"

export const requireToken = (req, res, next) => {
    const { authorization } = req.headers;
    
    try {
        let token = authorization;
        
        if(!token) throw new Error('There is no token in the headers. Bearer should be used');

        token = token.split(' ')[1];

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        console.log(uid);

        req.uid = uid;
        
        next();
    } catch (error) {
        return res.status(401).json({error: error.message})
    }
}