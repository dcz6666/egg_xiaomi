module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    var d=new Date();
   
    const AdminSchema = new Schema({
      username: { type: String  },
      password: { type: String  },
      mobile: { type: String  },
      email: { type: String  },
      status: { type: Number,default:1  },
      role_id: { type:Schema.Types.ObjectId },
      add_time: {           
        type:Number,        
        default: d.getTime()
    
       },
       is_super: { type:Number,default:0}   //是否是超级管理员 1 表示超级管理员

    });

   
    return mongoose.model('Admin', AdminSchema,'admin');
}