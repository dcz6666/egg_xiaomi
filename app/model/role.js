module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    var d=new Date();
   
    const RoleSchema = new Schema({
      title: { type: String  },
      description: { type: String  },
      status: { type: Number,default:1  },
      add_time: {           
        type:Number,        
        default: d.getTime()
       },
    });

   
    return mongoose.model('Role', RoleSchema,'role');
}