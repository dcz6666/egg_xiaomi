module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    var d = new Date();

    const GoodsTypeAttributeSchema = new Schema({
        cate_id: { type: Schema.Types.ObjectId },
        title: { type: String },
        attr_type: { type: String }, //类型 input checkbox radio select 
        attr_value: { type: String }, //指定默认的多选内容  select 框默认值 多个默认值以回车隔开
        status: { type: Number, default: 1 },
        add_time: {
            type: Number,
            default: d.getTime()
        }
    });


    return mongoose.model('GoodsTypeAttribute', GoodsTypeAttributeSchema, 'goods_type_attribute');
}