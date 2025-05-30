const Products = require('../models/productModel');


//filter,sorting and pagination

class APIfeatures{
    constructor(query,queryString){
        this.query = query
        this.queryString = queryString
    }
    filtering(){
      const queryObj = {...this.queryString}


      const excludedFields = ['page','sort','limit'] 
      excludedFields.forEach(el=> delete queryObj[el])
    

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)


        this.query.find(JSON.parse(queryStr))

      return this
     }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }
        else{
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    pagination(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 10
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}






const productCtrl = {
    getProducts:async(req,res)=>{
        try{
            console.log(req.query);
        const features = new APIfeatures(Products.find(),req.query).filtering().sorting().pagination()
        const products =await features.query
        res.json({products})
        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
    },

createProduct:async(req,res)=>{
        try{
            const {product_id,title,price,description,content,images,category} = req.body
            if(!images) return res.status(500).json({msg:"No image upload"});

                const product = await Products.findOne({product_id})
                if (product)  return res.status(400).json({msg:"This product already exists."});

                const newProduct = new Products({
                  product_id, title: title.toLowerCase(), price, description, content, images, category
                })
                await newProduct.save()
                res.json({msg:"Product created successfully"})
        }
        catch{
            return res.status(500).json({msg:err.message})
        }
},
deleteProduct:async(req,res)=>{
    try{
    await Products.findByIdAndDelete(req.params.id)
    res.json({msg:"Product deleted successfully"})
    }
    catch(err){
        return res.status(500).json({msg:err.message})
    }
},
updateProduct:async(req,res)=>{
    try{
        const {title,price,description,content,images,category} = req.body
        if(!images) return res.status(500).json({msg:"No image upload"});

       await Products.findByIdAndUpdate({_id:req.params.id},{
            title:title.toLowerCase(), price, description, content, images, category
        })

        res.json({msg:"Product updated successfully"})
    }
    catch(err){
        return res.status(500).json({msg:err.message})
    }
}
}


module.exports = productCtrl