const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({

firstname: {
    type: String,
    required: true
},
lastname: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    minLength: 6,
    required: true
},
urls:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Url'
    }
],

analytics:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analytics'
},

loginDate:{
    type: Date
},
createdAt:{
    type: Date
},
updatedAt:{
    type: Date
}
});

UserSchema.pre(
    'save',
    async function (next) {
        if(this.isModified("password")){
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
        next();
    }
}
);





UserSchema.methods.toCheckPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }


const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel