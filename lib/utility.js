function sendSuccessResponse(res,data,code,message){
   return res.status(code||200).json({
    code:code||200,
    data:data||{},
    message:message||"success"
   })
}
module.exports={sendSuccessResponse};