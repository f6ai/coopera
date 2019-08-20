const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'host', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChangedAt: Date,
  // active is for future delete function which is not implemented
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// ENCRYPT THE PASSWORD
userSchema.pre('save', async function(next) {
  // only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// userSchema.pre(/^find/, function(next) {
//   // this points to the current query
//   this.find({ active: { $ne: false } });
//   next();
// });

// INSTANCE METHODS -> available in all of the documents
// check if upon logging in the user gives the right password
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// check if password has been changed after a JWT token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    // convert passwordChangedAt into seconds from milliseconds
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

// generate a random password reset token (it doesn't need a very strong encryption)
// userSchema.methods.createPasswordResetToken = function() {
//   // this stuff is specific to the built-in crypto package
//   const resetToken = crypto.randomBytes(32).toString('hex');
//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');
//   // console.log({ resetToken }, this.passwordResetToken);
//   // expires in 10 min
//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
//   // send the plain reset token via email, and store the encrypted one in DB
//   return resetToken;
// };

const User = mongoose.model('User', userSchema);

module.exports = User;
