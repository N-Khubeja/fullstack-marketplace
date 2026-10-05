const User = require("../models/User")
const cloudinary = require("../config/cloudinary")
const streamifier = require("streamifier") 
const bcrypt = require("bcrypt"); 
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const hashToken = (token) => 
        crypto.createHash('sha256').update(token).digest('hex')

async function getALLUsers(req,res){
    try {
        const users = await User.find().select('-password -refreshTokens')
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}



async function updateUser(req, res) {
    try {
        const user = req.user;
        const { email, name } = req.body;

        const hasUpdates =
email !== undefined ||
name !== undefined ||
Boolean(req.file)

if (!hasUpdates) {
    return res.status(400).json({ message: "Nothing to update" })
}


        if (email) {
            const existingUser = await User.findOne({ email });

            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(409).json({ message: "Email already in use" });
            }
        }

        const allowedUpdates = ["email","name"]

        const updates = {}

        allowedUpdates.forEach((item) => {
            if(req.body[item] !== undefined){
                updates[item] = req.body[item]
            }
        })
        


        const oldPublicID = user.icon?.publicId || null

if (req.file) {
    
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "users" },
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }
        )
        streamifier.createReadStream(req.file.buffer).pipe(stream)
    })

    updates.icon = {
    url: result.secure_url,
    publicId: result.public_id
    }
}


        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            updates,
            {
        new: true,
        runValidators: true
    }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.file && oldPublicID) {
            await cloudinary.uploader.destroy(oldPublicID)
        }

        res.json({
            message: "Updated successfully",
   user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        icon: updatedUser.icon
    }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function deleteUser(req, res) {
    const user = req.user

    try {

        if(user.icon?.publicId){
             const publicId = user.icon.publicId
            await cloudinary.uploader.destroy(publicId)
        }

        const deletedUser = await User.findByIdAndDelete(req.user._id);

        if(!deletedUser){
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to delete user" });
    }
}


async function getProfile(req,res){
    try {
        const {email,name,_id,role,icon} = req.user
        
        res.status(200).json({
            id:_id,
            name:name,
            email:email,
            role:role,
            icon:icon
        })

    } catch (error) {
        res.status(500).json({message:"nononono"})
    }
}

async function ChangePassword(req,res){
  try {
    const {oldpassword,newpassword,confirmNewPassword} = req.body
    const user = await User.findById(req.user._id)

    if(!oldpassword || !newpassword || !confirmNewPassword ){
        return res.status(400).json({message:"password is missing"})
    }

    if(newpassword !== confirmNewPassword){
        return res.status(400).json({message:"passwords do not match"})
    }
    
    if(newpassword === oldpassword){
        return res.status(400).json({message:"same password"})
    }
    
    const passwordCheck = await bcrypt.compare(oldpassword,user.password)
    if(!passwordCheck){
        return res.status(401).json({message:"incorrect password"})
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newpassword, salt)

    const newRefreshToken = jwt.sign(
                {id:user._id},
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: "7d" }
    )

 const currentRefreshToken = req.cookies.refreshToken

const currentSession = currentRefreshToken
    ? user.refreshTokens.find(
        t => t.token === hashToken(currentRefreshToken)
    )
    : null

    user.refreshTokens = []
    user.refreshTokens.push({
            token: hashToken(newRefreshToken),
            device: currentSession?.device || req.headers['user-agent'] || 'unknown',
            createdAt: new Date()
    })

    await user.save()

    res.cookie('refreshToken', newRefreshToken, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'lax',
           maxAge: 7 * 24 * 60 * 60 * 1000,
           path: '/'
        });

    res.status(200).json({message:"password updated successfully"})

  } catch (error) {
     res.status(500).json({message:"failed to change password"})
  }
}


module.exports = {getALLUsers,updateUser,deleteUser,getProfile,ChangePassword}