module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    var d=new Date();
   
    const RoleAccessSchema = new Schema({
      access_id: { type:Schema.Types.ObjectId },
      role_id: { type:Schema.Types.ObjectId  },
    });

   
    return mongoose.model('RoleAccess', RoleAccessSchema,'role_access');
}