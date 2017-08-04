const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const bcrypt   = require("bcrypt");
const SALT_ROUNDS = 10;

const userSchema = new Schema({
    name: String,
    password: String,
    admin: Boolean
});

userSchema.pre('save', function(next) {
  let user = this;

  // only hash the password if it has been modified (or is new)
  if ( ! user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_ROUNDS, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.validPassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);

        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);