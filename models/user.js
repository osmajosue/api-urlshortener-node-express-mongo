import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: { unique: true },
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function (next) {
    const user = this;

    if(!user.isModified('password')) return next();

    try {
        const hops = await bcryptjs.genSalt(15);
        user.password = await bcryptjs.hash(user.password, hops);
        next();
    } catch (error) {
        console.log(error);
        throw new Error("PW hash has failed");
    }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcryptjs.compare(candidatePassword, this.password)
};

export const User = mongoose.model('User', userSchema);