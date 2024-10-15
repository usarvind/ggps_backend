module.exports= {
    addcreatedby:function (req,res,next) {
        req.body.created_by=req.decode.UserId
        next();
    },
    addmodifyby:function (req,res,next) {
        req.body.modified_date=Date.now();
        req.body.modified_by=req.decode.UserId;
        next();
    },
    delete:function (req,res,next) {
        req.body.modified_date=Date.now();
        req.body.modified_by=req.decode.UserId;
        req.body.status=0;
        next();
    }

}
